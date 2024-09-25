import { Module } from '@nestjs/common';
import { ImageRekognitionService } from './image-rekognition.service';
import { ImageCheckingService } from './image-checking.service';

@Module({
  providers: [ImageRekognitionService, ImageCheckingService],
})
export class ImageRekognitionModule {}
