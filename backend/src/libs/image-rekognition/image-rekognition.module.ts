import { Module } from '@nestjs/common';
import { ImageRekognitionService } from './image-rekognition.service';

@Module({
  providers: [ImageRekognitionService],
  exports: [ImageRekognitionService],
})
export class ImageRekognitionModule {}
