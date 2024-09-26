import { Module } from '@nestjs/common';
import { DATA_SOURCE } from 'src/libs/database/database.constants';
import { DatabaseModule } from 'src/libs/database/database.module';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { POST_REPO } from './post.interface';
import { PostRepo } from './post.repository';
import { PostService } from './post.service';
import { ImageRekognitionModule } from 'src/libs/image-rekognition/image-rekognition.module';
import { BullModule } from '@nestjs/bull';
import { IMG_REKOGNITION_QUEUE_NAME } from 'src/common/constants';
import { PostProcessor } from './post-detect.processor';

@Module({
  imports: [
    DatabaseModule,
    ImageRekognitionModule,
    BullModule.registerQueue({
      name: IMG_REKOGNITION_QUEUE_NAME,
    }),
  ],
  controllers: [PostController],
  providers: [
    {
      provide: POST_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
      inject: [DATA_SOURCE],
    },
    PostRepo,
    PostService,
    PostProcessor,
  ],
})
export class PostModule {}
