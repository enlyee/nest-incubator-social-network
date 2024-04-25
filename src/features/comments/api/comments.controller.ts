import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { AccessTokenGuard } from '../../../common/guards/jwt.auth.guard';
import { Request } from 'express';
import { CommentsService } from '../application/comments.service';
import { JwtAccessOutput } from '../../../common/strategies/jwt.strategy';
import { CommentsInputModel } from './models/input/comments.input.model';
import { LikesInputModel } from '../../likes/api/models/input/likes.input.model';
import { CommentsLikesService } from '../../likes/application/comments-likes.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsLikesService: CommentsLikesService,
  ) {}
  @Get(':id')
  async getCommentById(@Param('id') id: string, @Req() req: Request) {
    const userInfo = req.user as JwtAccessOutput;
    const comment = await this.commentsQueryRepository.getById(
      id,
      userInfo ? userInfo.userId : null,
    );
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request) {
    const userInfo = req.user as JwtAccessOutput;
    const deleteCommentStatus = await this.commentsService.delete(
      id,
      userInfo.userId,
    );
    if (deleteCommentStatus === -1) throw new NotFoundException();
    if (deleteCommentStatus === 0) throw new ForbiddenException();
    return;
  }

  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() content: CommentsInputModel,
  ) {
    const userInfo = req.user as JwtAccessOutput;
    const deleteCommentStatus = await this.commentsService.update(
      id,
      userInfo.userId,
      content.content,
    );
    if (deleteCommentStatus === -1) throw new NotFoundException();
    if (deleteCommentStatus === 0) throw new ForbiddenException();
    return;
  }

  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  @Put(':id/like-status')
  async like(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() likeStatus: LikesInputModel,
  ) {
    const userInfo = req.user as JwtAccessOutput;
    const status = await this.commentsLikesService.like(
      id,
      userInfo.userId,
      likeStatus.likeStatus,
    );
    if (!status) throw new NotFoundException();
    return;
  }
}
