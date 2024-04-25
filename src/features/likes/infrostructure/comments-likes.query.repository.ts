import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsLike } from '../domain/comments-like.entity';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsLikesQueryRepository {
  constructor(
    @InjectDataSource()
    private connection: DataSource,
  ) {}

  async getMyStatusForList(comments: string[], userId: string) {
    const likes: CommentsLike[] = await this.connection.query(
      `SELECT * FROM public."commentsLikes" WHERE "commentId" =ANY ($1) AND "userId" = $2`,
      [comments, userId],
    );
    const statuses = likes.map((c: CommentsLike) => {
      return { commentId: c.commentId, status: c.status };
    });
    return statuses;
  }

  async getLikesInfo(commentId: string) {
    const reactions = await this.connection.query(
      `SELECT (SELECT count(1) FROM public."commentsLikes" WHERE "commentId" = $1 AND status = 'Like') AS likes, (SELECT count(1) FROM public."commentsLikes" WHERE "commentId" = $1 AND status = 'Dislike') AS dislikes`,
      [commentId],
    );
    return reactions[0];
  }
}
