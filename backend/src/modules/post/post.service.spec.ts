import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { UniqueEntity } from 'src/common/common.interface';
import {
  IMG_REKOGNITION_JOB_NAME,
  IMG_REKOGNITION_QUEUE_NAME,
} from 'src/common/constants';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './entities/post.entity';
import { PostRepo } from './post.repository';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let postRepo: PostRepo;
  let configService: ConfigService;
  let imageModerationQueue: Queue;

  const mockPostRepo = {
    createEntity: jest.fn(),
    findPaging: jest.fn(),
    findOne: jest.fn(),
    updateEntity: jest.fn(),
    deleteEntity: jest.fn(),
    checkExisted: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockImageModerationQueue = {
    add: jest.fn(),
    getJobs: jest.fn(() => Promise.resolve([])), // Mock queue job retrieval
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PostRepo, useValue: mockPostRepo },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: 'BullQueue_' + IMG_REKOGNITION_QUEUE_NAME,
          useValue: mockImageModerationQueue,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepo = module.get<PostRepo>(PostRepo);
    configService = module.get<ConfigService>(ConfigService);
    imageModerationQueue = module.get<Queue>('BullQueue_' + IMG_REKOGNITION_QUEUE_NAME);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post and add a job to the queue', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
      };
      const uniqueUser: UniqueEntity = { id: 1 };
      const fileName = 'image.jpg';

      const mockPost = {
        id: 1,
        ...createPostDto,
        image_url: 'http://test.com/image.jpg',
        status: PostStatus.OPEN,
      };

      mockPostRepo.createEntity.mockResolvedValue(mockPost);
      mockConfigService.get.mockReturnValue('http://test.com/');

      const result = await service.create(uniqueUser, createPostDto, fileName);

      expect(postRepo.createEntity).toHaveBeenCalledWith({
        ...createPostDto,
        image_url: 'http://test.com/image.jpg',
        status: PostStatus.OPEN,
        userId: 1,
      });

      expect(imageModerationQueue.add).toHaveBeenCalledWith(IMG_REKOGNITION_JOB_NAME, {
        postId: 1,
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw an error if user ID is missing', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
      };
      const uniqueUser: UniqueEntity = {}; // No user ID
      const fileName = 'image.jpg';

      await expect(service.create(uniqueUser, createPostDto, fileName)).rejects.toThrow(
        'User not found',
      );
      expect(postRepo.createEntity).not.toHaveBeenCalled();
      expect(imageModerationQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a list of posts and count', async () => {
      const mockPosts = [{ id: 'post1' }, { id: 'post2' }];
      mockPostRepo.findPaging.mockResolvedValue([mockPosts, 2]);

      const result = await service.findAll({ page: 1, pageSize: 10 }, {});

      expect(postRepo.findPaging).toHaveBeenCalledWith({ page: 1, pageSize: 10 }, {});
      expect(result).toEqual([mockPosts, 2]);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const mockPost = { id: 'post1', title: 'Test Post' };
      mockPostRepo.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne({ id: 1 });

      expect(postRepo.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = { status: PostStatus.APPROPRIATED };
      const uniqueUser = { id: 1 };
      const query = { id: 1 };

      mockPostRepo.checkExisted.mockResolvedValue(true);
      mockPostRepo.updateEntity.mockResolvedValue(true);

      const result = await service.update(uniqueUser, query, updatePostDto);

      expect(postRepo.checkExisted).toHaveBeenCalledWith({
        ...query,
        userId: uniqueUser.id,
      });
      expect(postRepo.updateEntity).toHaveBeenCalledWith(query, updatePostDto);
      expect(result).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const uniqueUser = { id: 1 };
      const query = { id: 1 };

      mockPostRepo.checkExisted.mockResolvedValue(true);
      mockPostRepo.deleteEntity.mockResolvedValue(true);

      const result = await service.remove(uniqueUser, query);

      expect(postRepo.checkExisted).toHaveBeenCalledWith({
        ...query,
        userId: uniqueUser.id,
      });
      expect(postRepo.deleteEntity).toHaveBeenCalledWith(query);
      expect(result).toBe(true);
    });
  });
});
