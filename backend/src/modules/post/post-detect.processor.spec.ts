import { Test, TestingModule } from '@nestjs/testing';
import { PostProcessor } from './post-detect.processor';
import { PostRepo } from './post.repository';
import { ImageRekognitionService } from 'src/libs/image-rekognition/image-rekognition.service';
import { Job } from 'bull';
import { JobRekognitionPayload } from './post.interface';
import { PostStatus } from './entities/post.entity';
import * as fs from 'fs';
import { IMG_REKOGNITION_ERROR_LABEL } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

describe('PostProcessor', () => {
  let configService: ConfigService;
  let postProcessor: PostProcessor;
  let postRepo: PostRepo;
  let imageRekognitionService: ImageRekognitionService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockPostRepo = {
    findOne: jest.fn(),
    updateEntity: jest.fn(),
  };

  const mockImageRekognitionService = {
    detectUnsafeImage: jest.fn(),
  };

  const mockJob: Job<JobRekognitionPayload> = {
    data: { postId: 1 },
    moveToCompleted: jest.fn(),
  } as any; // Type casting to match the Job type

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostProcessor,
        { provide: PostRepo, useValue: mockPostRepo },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ImageRekognitionService, useValue: mockImageRekognitionService },
      ],
    }).compile();

    postProcessor = module.get<PostProcessor>(PostProcessor);
    postRepo = module.get<PostRepo>(PostRepo);
    imageRekognitionService = module.get<ImageRekognitionService>(
      ImageRekognitionService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleCheck', () => {
    it('should process moderation check and update post status', async () => {
      const mockPost = {
        id: 1, // Changed from string to number
        image_url: 'http://localhost:3000/uploads/image.jpg',
      };
      const inappropriateLabels = [{ Name: 'Adult Content' }];
      mockPostRepo.findOne.mockResolvedValue(mockPost);
      mockImageRekognitionService.detectUnsafeImage.mockResolvedValue(
        inappropriateLabels,
      );

      // Mock the readImageFromLocal method to return a buffer
      jest
        .spyOn(postProcessor, 'readImageFromLocal')
        .mockResolvedValue(Buffer.from('mock image buffer'));

      await postProcessor.handleCheck(mockJob);

      expect(postRepo.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(imageRekognitionService.detectUnsafeImage).toHaveBeenCalled();
      expect(postRepo.updateEntity).toHaveBeenCalledWith(
        { id: 1 },
        {
          status: PostStatus.INAPPROPRIATE_DETECTED,
          labels: JSON.stringify(inappropriateLabels),
          label: 'Adult Content',
        },
      );
      expect(mockJob.moveToCompleted).toHaveBeenCalled();
    });

    it('should log error if post is not found', async () => {
      mockPostRepo.findOne.mockResolvedValue(null);

      await expect(postProcessor.handleCheck(mockJob)).rejects.toThrow(
        `Post with ID 1 not found`,
      );

      expect(postRepo.findOne).toHaveBeenCalledWith({ id: 1 }); // Changed to number
      expect(mockJob.moveToCompleted).toHaveBeenCalled();
    });

    it('should handle error during image processing', async () => {
      const mockPost = {
        id: 1, // Changed from string to number
        image_url: 'http://localhost:3000/uploads/image.jpg',
      };

      // Mock the readImageFromLocal method to return a buffer
      jest
        .spyOn(postProcessor, 'readImageFromLocal')
        .mockResolvedValue(Buffer.from('mock image buffer'));

      mockPostRepo.findOne.mockResolvedValue(mockPost);

      mockImageRekognitionService.detectUnsafeImage.mockRejectedValue(
        new Error('Rekognition error'),
      );

      await expect(postProcessor.handleCheck(mockJob)).rejects.toThrow(
        'Rekognition error',
      );
      expect(postRepo.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(mockPostRepo.updateEntity).toHaveBeenCalledWith(
        { id: 1 },
        { labels: IMG_REKOGNITION_ERROR_LABEL },
      );
      expect(mockJob.moveToCompleted).toHaveBeenCalled();
    });
  });

  // Mock implementation for readImageFromLocal
  describe('readImageFromLocal', () => {
    it('should read image from local uploads folder', async () => {
      const baseURL = 'http://localhost:3000/uploads/';
      const imagePath = `${baseURL}image.jpg`;
      const mockBuffer = Buffer.from('mock image buffer');

      mockConfigService.get.mockReturnValue(baseURL);

      // Mocking fs.readFileSync
      jest.spyOn(fs, 'readFileSync').mockReturnValue(mockBuffer);

      const result = await postProcessor['readImageFromLocal'](imagePath);

      expect(result).toEqual(mockBuffer);
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    it('should throw an error if reading image fails', async () => {
      const imagePath = 'image.jpg';
      const errorMessage = 'Unable to read image from local path';
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(postProcessor['readImageFromLocal'](imagePath)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
