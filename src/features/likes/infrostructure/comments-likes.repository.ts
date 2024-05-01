import { InjectModel } from '@nestjs/mongoose';
import { CommentLike } from '../domain/comments-like.entity';
import { Model } from 'mongoose';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { And, DataSource, Repository } from 'typeorm';

export class CommentsLikesRepository {
  constructor(
    @InjectRepository(CommentLike)
    private connection: Repository<CommentLike>,
  ) {}

  async likeComment(
    userId: string,
    status: 'Like' | 'Dislike' | 'None',
    commentId: string,
  ) {
    const state = await this.connection.update(
      { commentId: commentId, userId: userId },
      { status: status },
    );

    if (!state.affected) {
      const like = CommentLike.create(userId, commentId, status);
      await this.connection.save(like);
      return;
    }
    return;
  }
}
