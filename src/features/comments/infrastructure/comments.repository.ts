import { Injectable } from '@nestjs/common';
import { Comment } from '../domain/comments.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private connection: DataSource) {}
  async deleteById(id: string) {
    const deleteResult = await this.connection.query(
      `DELETE FROM public.comments WHERE id = $1`,
      [id],
    );
    return deleteResult[1];
  }

  async updateById(id: string, content: string) {
    const updateResult = await this.connection.query(
      `UPDATE public.comments SET content = $1 WHERE id = $2`,
      [content, id],
    );
    return updateResult.matchedCount;
  }

  async create(comment: Comment) {
    return (
      await this.connection.query(
        `INSERT INTO public.comments(id, content, "userId", "createdAt", "postId") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          comment.id,
          comment.content,
          comment.userId,
          comment.createdAt,
          comment.postId,
        ],
      )
    )[0];
  }
}
