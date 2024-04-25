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
import {
  PostsInputModel,
  PostsQueryFixedModel,
} from './models/input/posts.input.model';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { PostsQueryPipe } from '../../../common/pipes/posts.query.pipe';
import { Request } from 'express';
import { JwtAccessOutput } from '../../../common/strategies/jwt.strategy';
import { CommentsQueryPipe } from '../../../common/pipes/comments.query.pipe';
import { CommentsQueryFixedModel } from '../../comments/api/models/input/comments.query.input.model';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { AccessTokenGuard } from '../../../common/guards/jwt.auth.guard';
import { CommentsInputModel } from '../../comments/api/models/input/comments.input.model';
import { CommentsService } from '../../comments/application/comments.service';
import { BasicAdminGuard } from '../../../common/guards/basic.auth.guard';
import { LikesInputModel } from '../../likes/api/models/input/likes.input.model';
import { PostsLikesService } from '../../likes/application/posts-likes.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly postsLikesService: PostsLikesService,
  ) {}

  @UseGuards(BasicAdminGuard)
  @HttpCode(201)
  @Post()
  async create(@Body() postModel: PostsInputModel) {
    const status = await this.postsService.create(postModel);
    if (!status) throw new NotFoundException();
    return status;
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: Request) {
    const userInfo = req.user as JwtAccessOutput;
    const post = await this.postsQueryRepository.getById(id, userInfo?.userId);
    if (!post) throw new NotFoundException();
    return post;
  }

  @UseGuards(BasicAdminGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const status = await this.postsService.deleteById(id);
    if (!status) throw new NotFoundException();
  }

  @Get()
  async getAll(
    @Query(PostsQueryPipe) query: PostsQueryFixedModel,
    @Req() req: Request,
  ) {
    const userInfo = req.user as JwtAccessOutput;
    const posts = this.postsQueryRepository.getAll(
      query,
      null,
      userInfo?.userId,
    );
    return posts;
  }

  @UseGuards(BasicAdminGuard)
  @HttpCode(204)
  @Put(':id')
  async update(@Param('id') id: string, @Body() postData: PostsInputModel) {
    const updateStatus: boolean = await this.postsService.updateById(
      id,
      postData,
    );
    if (!updateStatus) throw new NotFoundException();
  }

  @HttpCode(200)
  @Get(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Req() req: Request,
    @Query(CommentsQueryPipe) query: CommentsQueryFixedModel,
  ) {
    const postIsExists = await this.postsQueryRepository.getById(id);
    if (!postIsExists) throw new NotFoundException();
    const userInfo = req.user as JwtAccessOutput;
    console.log(userInfo);
    const comments = await this.commentsQueryRepository.getAllComments(
      id,
      query,
      userInfo.userId,
    );
    return comments;
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(201)
  @Post(':id/comments')
  async createComment(
    @Req() req: Request,
    @Param('id') postId: string,
    @Body() comment: CommentsInputModel,
  ) {
    const userInfo = req.user as JwtAccessOutput;
    const status = await this.commentsService.create(
      userInfo.userId,
      postId,
      comment.content,
    );
    if (!status) throw new NotFoundException();
    return status;
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async like(
    @Req() req: Request,
    @Body() status: LikesInputModel,
    @Param('id') id: string,
  ) {
    const userInfo = req.user as JwtAccessOutput;
    const result = await this.postsLikesService.like(
      id,
      userInfo.userId,
      status.likeStatus,
    );
    if (!result) throw new NotFoundException();
    return;
  }
}
