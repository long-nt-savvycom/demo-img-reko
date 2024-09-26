import { FileInterceptor, UploadedFile } from '@blazity/nest-file-fastify';
import { MultipartFile } from '@fastify/multipart'; // Import the MultipartFile type
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Body, Controller, Post, Request, UseInterceptors } from '@nestjs/common';
import { AppRequest, GenericFilter } from 'src/common/common.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPost, IPostRes, PaginatePostResponse } from './post.interface';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * @tag Post
   * @security bearer
   */
  // @TypedRoute.Post()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/',
    }),
  )
  async create(
    @Request() req: AppRequest,
    // @TypedBody() createPostDto: CreatePostDto,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: MultipartFile,
  ): Promise<IPostRes | undefined> {
    return this.postService.create(req.user, createPostDto, file?.filename);
  }

  /**
   * @tag Post
   * @security bearer
   */
  @TypedRoute.Get()
  async findAll(
    @Request() req: AppRequest,
    @TypedQuery() query: GenericFilter<IPost>,
  ): Promise<PaginatePostResponse> {
    const [posts, total] = await this.postService.findAll(query, { userId: req.user.id });
    return { posts, total };
  }

  /**
   * @tag Post
   * @security bearer
   */
  @TypedRoute.Get(':id')
  findOne(
    @Request() req: AppRequest,
    @TypedParam('id') id: number,
  ): Promise<IPostRes | null> {
    return this.postService.findOne({ id });
  }

  /**
   * @tag Post
   * @security bearer
   */
  @TypedRoute.Patch(':id')
  update(
    @Request() req: AppRequest,
    @TypedParam('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    return this.postService.update({ id: req.user.id }, { id }, updatePostDto);
  }

  /**
   * @tag Post
   * @security bearer
   */
  @TypedRoute.Delete(':id')
  remove(@Request() req: AppRequest, @TypedParam('id') id: number): Promise<boolean> {
    return this.postService.remove({ id: req.user.id }, { id });
  }
}
