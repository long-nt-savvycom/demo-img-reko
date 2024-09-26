import {
  DetectModerationLabelsCommand,
  DetectModerationLabelsResponse,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ImageRekognitionService } from './image-rekognition.service';

jest.mock('@aws-sdk/client-rekognition'); // Mock the AWS SDK Rekognition Client

describe('ImageRekognitionService', () => {
  let service: ImageRekognitionService;
  let mockRekognitionClient: RekognitionClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageRekognitionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'AWS_REGION':
                  return 'us-east-1';
                case 'AWS_ACCESS_KEY_ID':
                  return 'mock-access-key-id';
                case 'AWS_SECRET_ACCESS_KEY':
                  return 'mock-secret-access-key';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ImageRekognitionService>(ImageRekognitionService);
    mockRekognitionClient = service['rekognitionClient'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('detectUnsafeImage', () => {
    it('should return moderation labels when detected', async () => {
      const mockResponse: DetectModerationLabelsResponse | never = {
        ModerationLabels: [
          {
            Name: 'Explicit Nudity',
            Confidence: 99.0,
          },
          {
            Name: 'Violence',
            Confidence: 98.0,
          },
        ],
      };

      // Mock the send method to resolve with the mock response
      jest.spyOn(mockRekognitionClient, 'send').mockResolvedValue(mockResponse as never);

      const imageBuffer = Buffer.from('mock-image');
      const result = await service.detectUnsafeImage(imageBuffer);

      expect(result).toEqual(mockResponse.ModerationLabels);
      expect(mockRekognitionClient.send).toHaveBeenCalledWith(
        expect.any(DetectModerationLabelsCommand),
      );
    });

    it('should return an empty array if no moderation labels are found', async () => {
      const mockResponse: DetectModerationLabelsResponse = {
        ModerationLabels: [],
      };

      // Mock the send method to resolve with the mock response
      jest.spyOn(mockRekognitionClient, 'send').mockResolvedValue(mockResponse as never);

      const imageBuffer = Buffer.from('mock-image');
      const result = await service.detectUnsafeImage(imageBuffer);

      expect(result).toEqual([]);
      expect(mockRekognitionClient.send).toHaveBeenCalledWith(
        expect.any(DetectModerationLabelsCommand),
      );
    });

    it('should throw an error when AWS Rekognition throws an error', async () => {
      const mockError = new Error('AWS Error');

      // Mock the send method to reject with an error
      jest.spyOn(mockRekognitionClient, 'send').mockRejectedValue(mockError as never);

      const imageBuffer = Buffer.from('mock-image');

      await expect(service.detectUnsafeImage(imageBuffer)).rejects.toThrow('AWS Error');
      expect(mockRekognitionClient.send).toHaveBeenCalledWith(
        expect.any(DetectModerationLabelsCommand),
      );
    });

    it('should throw an error if the input file is invalid', async () => {
      const invalidImageBuffer = Buffer.from(''); // Simulate invalid data

      await expect(service.detectUnsafeImage(invalidImageBuffer)).rejects.toThrow(
        'Invalid image data',
      );

      expect(mockRekognitionClient.send).not.toHaveBeenCalled(); // Ensures Rekognition is not called
    });
  });
});
