import { Test, TestingModule } from '@nestjs/testing';
import { ImageRekognitionService } from './image-rekognition.service';
import { ConfigService } from '@nestjs/config';
import { Rekognition } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mockRekognition = {
    detectLabels: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    Rekognition: jest.fn(() => mockRekognition),
  };
});

describe('ImageRekognitionService', () => {
  let service: ImageRekognitionService;
  let rekognition: Rekognition;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageRekognitionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'AWS_ACCESS_KEY_ID':
                  return 'mockAccessKey';
                case 'AWS_SECRET_ACCESS_KEY':
                  return 'mockSecretKey';
                case 'AWS_REGION':
                  return 'mockRegion';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ImageRekognitionService>(ImageRekognitionService);
    configService = module.get<ConfigService>(ConfigService);
    rekognition = new Rekognition(); // This will use the mock defined above
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call rekognition.detectLabels with the correct parameters', async () => {
    const mockImageBuffer = Buffer.from('mock-image');
    const mockLabels = {
      Labels: [
        { Name: 'Person', Confidence: 98.5 },
        { Name: 'Car', Confidence: 96.1 },
      ],
    };

    (rekognition.detectLabels().promise as jest.Mock).mockResolvedValueOnce(mockLabels);

    const result = await service.detectLabels(mockImageBuffer);

    expect(rekognition.detectLabels).toHaveBeenCalledWith({
      Image: { Bytes: mockImageBuffer },
      MaxLabels: 10,
      MinConfidence: 75,
    });
    expect(result).toEqual(mockLabels);
  });

  it('should handle errors from rekognition', async () => {
    const mockImageBuffer = Buffer.from('mock-image');
    const mockError = new Error('AWS Rekognition Error');

    (rekognition.detectLabels().promise as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(service.detectLabels(mockImageBuffer)).rejects.toThrow(
      'AWS Rekognition Error',
    );
  });
});
