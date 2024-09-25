import { Injectable } from '@nestjs/common';
import { ImageRekognitionService } from './image-rekognition.service';
import { ConfigService } from '@nestjs/config';

const inappropriateKeywords = [
  'Weapons',
  'Violence',
  'Explicit Nudity',
  'Sexual Activity',
  'Substance Abuse',
  'Hate Symbols',
  'Self-Harm',
  'Graphic Content',
  'Child Abuse',
  'Animal Abuse',
];

const inappropriateParentKeywords = [
  'Violence',
  'Adult',
  'Substance Abuse',
  'Hate',
  'Self-Harm',
  'Sensitive Issues',
];

@Injectable()
export class ImageCheckingService extends ImageRekognitionService {
  constructor(protected readonly configService: ConfigService) {
    super(configService);
  }

  async isInAppropriate(imageBuffer: Buffer): Promise<boolean> {
    const validLabels: string[] = [
      ...inappropriateKeywords,
      ...inappropriateParentKeywords,
    ];
    const detectedLabels = await this.detectLabels(imageBuffer);
    const labels = detectedLabels.Labels;
    const labelNames = labels?.map((label) => label.Name) || [];

    return Array.isArray(labelNames) && labelNames?.length > 0
      ? validLabels.includes(labelNames[0] || '')
      : false;
  }
}
