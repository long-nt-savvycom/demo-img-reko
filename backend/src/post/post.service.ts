import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

import { GenericFilter, SortOrder } from 'src/common/common.interface';
import { UniqueUser } from 'src/user/user.interface';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FindManyPost, IPost, POST_REPO, UniquePost } from './post.interface';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @Inject(POST_REPO)
    private readonly postRepo: Repository<Post>,
  ) {}

  protected async checkExisted(query: FindOptionsWhere<Post>): Promise<number> {
    const existed = await this.postRepo.count({ where: query });
    if (!existed) {
      throw new NotFoundException('POST_NOT_FOUND');
    }
    return existed;
  }

  public async create(
    uniqueUser: Partial<UniqueUser>,
    createPostDto: CreatePostDto,
  ): Promise<IPost> {
    const post = this.postRepo.create({
      ...createPostDto,
      views: 0,
      userId: uniqueUser.id,
    });
    return this.postRepo.save(post);
  }

  protected createOrderQuery(filter: GenericFilter<IPost>) {
    const order: { [k in keyof Partial<IPost>]: SortOrder } = {};

    order.created_at = SortOrder.DESC;

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder || SortOrder.DESC;
      return order;
    }
    this.logger.debug({ order });
    return order;
  }

  public findAll(
    filter: GenericFilter<IPost>,
    query: FindManyPost,
  ): Promise<[IPost[], number]> {
    return this.postRepo.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: query,
    });
  }

  public async findOne(query: UniquePost): Promise<IPost | null> {
    console.log({ query });
    return this.postRepo.findOne({ where: query });
  }

  public async update(
    uniqueUser: Partial<UniqueUser>,
    query: UniquePost,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    await this.checkExisted({ ...query, userId: uniqueUser.id });
    return this.postRepo.update(query, updatePostDto);
  }

  public async remove(
    uniqueUser: Partial<UniqueUser>,
    query: UniquePost,
  ): Promise<UpdateResult> {
    await this.checkExisted({ ...query, userId: uniqueUser.id });
    return this.postRepo.softDelete(query);
  }
}
