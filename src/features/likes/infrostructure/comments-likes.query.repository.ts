import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLike } from '../domain/comments-like.entity';
import { connection, Model } from 'mongoose';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { And, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class CommentsLikesQueryRepository {
  constructor(
    @InjectRepository(CommentLike)
    private connection: Repository<CommentLike>,
  ) {}

  async getMyStatusForList(comments: string[], userId: string) {
    const likes = await this.connection.find({
      where: { commentId: In(comments), userId: userId },
    });
    const statuses = likes.map((c: CommentLike) => {
      return { commentId: c.commentId, status: c.status };
    });
    return statuses;
  }

  async getLikesInfo(commentId: string) {
    const reactions: any = await this.connection
      .createQueryBuilder('l')
      .select(`SUM(CASE WHEN status='Like' THEN 1 ELSE 0 END) as likes`)
      .addSelect(
        `SUM(CASE WHEN status='Dislike' THEN 1 ELSE 0 END) as dislikes`,
      )
      .where(`"commentId" = :commentId`, { commentId: commentId })
      .getRawOne();
    return reactions;
  }
}
