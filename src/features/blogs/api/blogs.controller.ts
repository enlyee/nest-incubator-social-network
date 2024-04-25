import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
} from '@nestjs/common';

import { BlogsQueryPipe } from '../../../common/pipes/blogs.query.pipes';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { BlogsQueryFixedModel } from './models/input/blogs.query.input.model';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { PostsQueryPipe } from '../../../common/pipes/posts.query.pipe';
import { PostsQueryFixedModel } from '../../posts/api/models/input/posts.input.model';
import { Request } from 'express';
import { JwtAccessOutput } from '../../../common/strategies/jwt.strategy';
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async get(@Query(BlogsQueryPipe) query: BlogsQueryFixedModel) {
    const blogs = await this.blogsQueryRepository.getBlogs(query);
    return blogs;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.getBlogById(id);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @Get(':id/posts')
  async getPosts(
    @Param('id') id: string,
    @Query(PostsQueryPipe) query: PostsQueryFixedModel,
    @Req() req: Request,
  ) {
    const blogExist = await this.blogsQueryRepository.getBlogById(id);
    if (!blogExist) throw new NotFoundException();
    const userInfo = req.user as JwtAccessOutput;
    const posts = await this.postsQueryRepository.getAll(
      query,
      id,
      userInfo?.userId,
    );
    return posts;
  }
}
