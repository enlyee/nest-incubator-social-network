import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { BasicAdminGuard } from '../../../common/guards/basic.auth.guard';
import { BlogsInputModel } from './models/input/blogs.input.model';
import { BlogsOutputModel } from './models/output/blogs.output.model';
import { BlogsQueryPipe } from '../../../common/pipes/blogs.query.pipes';
import { BlogsQueryFixedModel } from './models/input/blogs.query.input.model';
import { PostsQueryPipe } from '../../../common/pipes/posts.query.pipe';
import {
  PostsInputModelForBlogs,
  PostsQueryFixedModel,
} from '../../posts/api/models/input/posts.input.model';
import { Request } from 'express';
import { JwtAccessOutput } from '../../../common/strategies/jwt.strategy';
import { PostsService } from '../../posts/application/posts.service';

@UseGuards(BasicAdminGuard)
@Controller('sa/blogs')
export class BlogsControllerSa {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  async create(
    @Body() createModel: BlogsInputModel,
  ): Promise<BlogsOutputModel> {
    const createdBlog = await this.blogsService.create(createModel);
    return createdBlog;
  }

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

  @HttpCode(204)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateModel: BlogsInputModel,
  ) {
    const blog = await this.blogsService.updateById(id, updateModel);
    if (!blog) throw new NotFoundException();
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const status = await this.blogsService.deleteById(id);
    if (!status) throw new NotFoundException();
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

  @Post(':id/posts')
  async createPost(
    @Param('id') blogId: string,
    @Body() postData: PostsInputModelForBlogs,
  ) {
    const post = await this.blogsService.createPost(blogId, postData);
    if (!post) throw new NotFoundException();
    return post;
  }

  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() postData: PostsInputModelForBlogs,
  ) {
    const updateStatus: boolean = await this.postsService.updateById(
      postId,
      postData,
      blogId,
    );
    if (!updateStatus) throw new NotFoundException();
  }

  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePostById(
    @Param('postId') postId: string,
    @Param('blogId') blogId: string,
  ) {
    const status = await this.postsService.deleteById(postId, blogId);
    if (!status) throw new NotFoundException();
  }
}
