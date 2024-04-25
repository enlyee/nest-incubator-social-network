import { InjectModel } from '@nestjs/mongoose';
import { CommentsLike } from '../domain/comments-like.entity';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class CommentsLikesRepository {
  constructor(
    @InjectDataSource()
    private connection: DataSource,
  ) {}

  async likeComment(
    userId: string,
    status: 'Like' | 'Dislike' | 'None',
    commentId: string,
  ) {
    const state = await this.connection.query(
      `UPDATE public."commentsLikes" SET status = $1 WHERE "commentId" = $2 AND "userId" = $3`,
      [status, commentId, userId],
    );

    if (!state[1]) {
      const like = new CommentsLike(userId, commentId, status);
      await this.connection.query(
        `INSERT INTO public."commentsLikes" ( "userId", "commentId", status) VALUES ($1, $2, $3);`,
        [like.userId, like.commentId, like.status],
      );
      return;
    }
    return;
  }
}
