import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PostRepo } from './post.repository';
import { PostStatus } from './entities/post.entity';
import { ImageRekognitionService } from 'src/libs/image-rekognition/image-rekognition.service';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  IMG_REKOGNITION_ERROR_LABEL,
  IMG_REKOGNITION_JOB_NAME,
  IMG_REKOGNITION_QUEUE_NAME,
} from 'src/common/constants';
import { JobRekognitionPayload } from './post.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Processor(IMG_REKOGNITION_QUEUE_NAME)
export class PostProcessor {
  private readonly logger = new Logger(PostProcessor.name);

  constructor(
    private readonly postRepo: PostRepo,
    private readonly imageRekognitionService: ImageRekognitionService,
    private readonly configService: ConfigService,
  ) {}

  @Process(IMG_REKOGNITION_JOB_NAME)
  public async handleCheck(job: Job<JobRekognitionPayload>): Promise<void> {
    const { postId } = job.data;
    this.logger.log(`Job Id ${job.id} Processing moderation check for postId ${postId}`);

    const post = await this.postRepo.findOne({ id: postId });
    try {
      // Fetch post from the database
      if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
      }

      // Read the image from the local "uploads" folder
      const imageBuffer = await this.readImageFromLocal(post.image_url);

      // Call the Rekognition service to check for unsafe content
      const hasInappropriateContent =
        await this.imageRekognitionService.detectUnsafeImage(imageBuffer);
      this.logger.debug({ hasInappropriateContent });

      const isInappropriate = hasInappropriateContent.length > 0;
      // Update post status based on the moderation result
      await this.postRepo.updateEntity(
        { id: post.id },
        {
          status: isInappropriate
            ? PostStatus.INAPPROPRIATE_DETECTED
            : PostStatus.APPROPRIATED,
          labels: isInappropriate ? JSON.stringify(hasInappropriateContent) : undefined,
          label: isInappropriate ? hasInappropriateContent[0].Name : undefined,
        },
      );

      this.logger.debug(`Post ${postId} has been moderated and updated.`);
    } catch (error) {
      if (post?.id) {
        await this.postRepo.updateEntity(
          { id: post?.id },
          {
            labels: IMG_REKOGNITION_ERROR_LABEL,
          },
        );
      }

      throw error;
    } finally {
      job.moveToCompleted();
    }
  }

  // Helper function to read the image from the local "uploads" folder
  public async readImageFromLocal(imagePath: string): Promise<Buffer> {
    try {
      // TODO: move local to S3 to remove this logic
      const baseURL = this.configService.get('UPLOAD_DOMAIN_URI');
      const parts = imagePath.split(baseURL);
      const fullPath = path.join(process.cwd(), 'uploads', parts[1]);

      const imageBuffer = fs.readFileSync(fullPath);
      return imageBuffer;
    } catch (error) {
      throw new Error('Unable to read image from local path');
    }
  }
}
