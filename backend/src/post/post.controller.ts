import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Body, Controller, Request } from '@nestjs/common';
import { AppRequest, GenericFilter } from 'src/common/common.interface';
import { UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPost, PaginatePostResponse } from './post.interface';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * @tag Post
   * @security bearer
   */
  @TypedRoute.Post()
  create(
    @Request() req: AppRequest,
    @TypedBody() createPostDto: CreatePostDto,
  ): Promise<IPost> {
    return this.postService.create(req.user, createPostDto);
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
    const [posts, total] = await this.postService.findAll(query, { user: req.user.id });
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
  ): Promise<IPost | null> {
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
  ): Promise<UpdateResult> {
    return this.postService.update({ id: req.user.id }, { id }, updatePostDto);
  }

  /**
   * @tag Post
   * @security bearer
   */
  @TypedRoute.Delete(':id')
  remove(
    @Request() req: AppRequest,
    @TypedParam('id') id: number,
  ): Promise<UpdateResult> {
    return this.postService.remove({ id: req.user.id }, { id });
  }
}
