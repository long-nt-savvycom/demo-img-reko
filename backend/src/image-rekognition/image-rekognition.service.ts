import { Injectable } from '@nestjs/common';
import { Rekognition } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageRekognitionService {
  private rekognition: Rekognition;

  constructor(private readonly configService: ConfigService) {
    this.rekognition = new Rekognition({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async detectLabels(imageBuffer: Buffer) {
    const params = {
      Image: {
        Bytes: imageBuffer,
      },
      MaxLabels: 10,
      MinConfidence: 75,
    };

    return this.rekognition.detectLabels(params).promise();
  }
}
