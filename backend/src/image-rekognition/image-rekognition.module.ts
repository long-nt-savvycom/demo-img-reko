import { Module } from '@nestjs/common';
import { ImageRekognitionService } from './image-rekognition.service';

@Module({
  providers: [ImageRekognitionService]
})
export class ImageRekognitionModule {}
