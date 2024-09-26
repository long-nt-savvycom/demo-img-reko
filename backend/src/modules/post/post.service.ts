import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { JobStatus, Queue } from 'bull';
import { GenericFilter, UniqueEntity } from 'src/common/common.interface';
import {
  IMG_REKOGNITION_JOB_NAME,
  IMG_REKOGNITION_QUEUE_NAME,
} from 'src/common/constants';
import { UniqueUser } from 'src/modules/user/user.interface';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostStatus } from './entities/post.entity';
import { FindManyPost, IPost, JobRekognitionPayload, UniquePost } from './post.interface';
import { PostRepo } from './post.repository';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    private readonly postRepo: PostRepo,
    private readonly configService: ConfigService,
    @InjectQueue(IMG_REKOGNITION_QUEUE_NAME) private readonly imageModerationQueue: Queue,
  ) {
    ['completed', 'delayed', 'failed', 'paused', 'waiting'].forEach((status) => {
      this.imageModerationQueue.getJobs([status as JobStatus]).then((jobs) => {
        this.logger.debug(`job ${status}: ${jobs.length}`);
      });
    });
  }

  public async create(
    uniqueUser: UniqueEntity,
    createPostDto: CreatePostDto,
    fileName: string,
  ): Promise<Post | undefined> {
    if (!uniqueUser?.id) {
      throw new Error('User not found');
    }
    if (uniqueUser.id) {
      const uri = this.configService.get('UPLOAD_DOMAIN_URI');
      // check case user not found
      const post = await this.postRepo.createEntity({
        ...createPostDto,
        image_url: `${uri}${fileName}`,
        status: PostStatus.OPEN,
        userId: uniqueUser.id,
      });

      const jobPayload: JobRekognitionPayload = { postId: post.id };
      await this.imageModerationQueue.add(IMG_REKOGNITION_JOB_NAME, jobPayload);

      return post;
    }
  }

  public findAll(
    filter: GenericFilter<IPost>,
    query: FindManyPost,
  ): Promise<[Post[], number]> {
    return this.postRepo.findPaging(filter, query);
  }

  public async findOne(query: UniquePost): Promise<Post | null> {
    return this.postRepo.findOne(query);
  }

  public async update(
    uniqueUser: Partial<UniqueUser>,
    query: UniquePost,
    updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    await this.postRepo.checkExisted({ ...query, userId: uniqueUser.id });
    return this.postRepo.updateEntity(query, updatePostDto);
  }

  public async remove(
    uniqueUser: Partial<UniqueUser>,
    query: UniquePost,
  ): Promise<boolean> {
    await this.postRepo.checkExisted({ ...query, userId: uniqueUser.id });
    return this.postRepo.deleteEntity(query);
  }
}
