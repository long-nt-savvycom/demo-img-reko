import {
  DetectModerationLabelsCommand,
  ModerationLabel,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageRekognitionService {
  protected rekognitionClient: RekognitionClient;

  constructor(protected readonly configService: ConfigService) {
    this.rekognitionClient = new RekognitionClient({
      region: String(this.configService.get<string>('AWS_REGION')),
      credentials: {
        accessKeyId: String(this.configService.get<string>('AWS_ACCESS_KEY_ID')),
        secretAccessKey: String(this.configService.get<string>('AWS_SECRET_ACCESS_KEY')),
      },
    });
  }

  async detectUnsafeImage(imageBuffer: Buffer): Promise<ModerationLabel[]> {
    if (!Buffer.isBuffer(imageBuffer) || imageBuffer.length == 0) {
      throw new Error('Invalid image data');
    }
    const customMinConfidence = this.configService.get<string>('MIN_CONFIDENCE');

    const command = new DetectModerationLabelsCommand({
      Image: {
        Bytes: imageBuffer, // You can also specify an S3Object if the image is stored in S3.
      },
      // Adjust this confidence level as per your needs
      MinConfidence: customMinConfidence ? Number(customMinConfidence) : 70,
    });

    const response = await this.rekognitionClient.send(command);
    return response.ModerationLabels || [];
  }
}
