import { Injectable } from '@nestjs/common';
import { Comment } from '../domain/comments.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment) private connection: Repository<Comment>,
  ) {}
  async deleteById(id: string) {
    const deleteResult = await this.connection.delete({ id: id });
    return !!deleteResult.affected;
  }

  async updateById(id: string, content: string) {
    const updateResult = await this.connection.update(
      { id: id },
      { content: content },
    );
    return updateResult.affected;
  }

  async create(comment: Comment) {
    const newComment = await this.connection.save(comment);
    return newComment;
  }
}
