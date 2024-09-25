import { Test, TestingModule } from '@nestjs/testing';
import { ImageCheckingService } from './image-checking.service';
import { ImageRekognitionService } from './image-rekognition.service';
import { ConfigService } from '@nestjs/config';

// Mocking ImageRekognitionService
jest.mock('./image-rekognition.service');

describe('ImageCheckingService', () => {
  let service: ImageCheckingService;
  let imageRekognitionService: ImageRekognitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageCheckingService,
        {
          provide: ImageRekognitionService,
          useValue: {
            detectLabels: jest.fn(),
          },
        },
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

    service = module.get<ImageCheckingService>(ImageCheckingService);
    imageRekognitionService = module.get<ImageRekognitionService>(
      ImageRekognitionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true for inappropriate keywords', async () => {
    const mockImageBuffer = Buffer.from('mock-image');

    // Mock the detectLabels method to return a label that is inappropriate
    const mockDetectedLabels = {
      Labels: [
        { Name: 'Weapons', Confidence: 95.0 },
        { Name: 'Car', Confidence: 85.0 },
      ],
    };

    jest
      .spyOn(imageRekognitionService, 'detectLabels')
      .mockResolvedValueOnce(mockDetectedLabels);

    const result = await service.isInAppropriate(mockImageBuffer);
    expect(result).toBe(true);
  });

  it('should return true for inappropriate parent keywords', async () => {
    const mockImageBuffer = Buffer.from('mock-image');

    // Mock the detectLabels method to return a parent label that is inappropriate
    const mockDetectedLabels = {
      Labels: [
        { Name: 'Violence', Confidence: 90.0 }, // Inappropriate parent keyword
        { Name: 'Person', Confidence: 85.0 },
      ],
    };

    jest
      .spyOn(imageRekognitionService, 'detectLabels')
      .mockResolvedValueOnce(mockDetectedLabels);

    const result = await service.isInAppropriate(mockImageBuffer);
    expect(result).toBe(true);
  });

  it('should return false for non-inappropriate labels', async () => {
    const mockImageBuffer = Buffer.from('mock-image');

    // Mock the detectLabels method to return labels that are not inappropriate
    const mockDetectedLabels = {
      Labels: [
        { Name: 'Person', Confidence: 90.0 },
        { Name: 'Car', Confidence: 85.0 },
      ],
    };

    jest
      .spyOn(imageRekognitionService, 'detectLabels')
      .mockResolvedValueOnce(mockDetectedLabels);

    const result = await service.isInAppropriate(mockImageBuffer);
    expect(result).toBe(false);
  });

  it('should return false when no labels are detected', async () => {
    const mockImageBuffer = Buffer.from('mock-image');

    // Mock the detectLabels method to return no labels
    const mockDetectedLabels = {
      Labels: [],
    };

    jest
      .spyOn(imageRekognitionService, 'detectLabels')
      .mockResolvedValueOnce(mockDetectedLabels);

    const result = await service.isInAppropriate(mockImageBuffer);
    expect(result).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    const mockImageBuffer = Buffer.from('mock-image');
    const mockError = new Error('AWS Rekognition Error');

    // Mock the detectLabels method to throw an error
    jest.spyOn(imageRekognitionService, 'detectLabels').mockRejectedValueOnce(mockError);

    await expect(service.isInAppropriate(mockImageBuffer)).rejects.toThrow(
      'AWS Rekognition Error',
    );
  });
});
