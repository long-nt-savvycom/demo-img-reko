import { Injectable } from '@nestjs/common';
import { Rekognition } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { DetectLabelsResponse } from 'aws-sdk/clients/rekognition';

@Injectable()
export class ImageRekognitionService {
  protected rekognition: Rekognition;

  constructor(protected readonly configService: ConfigService) {
    this.rekognition = new Rekognition({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async detectLabels(imageBuffer: Buffer): Promise<DetectLabelsResponse> {
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
