import { Post } from '../domain/posts.entity';
import { PostsOutputModel } from '../api/models/output/posts.output.model';
import { Injectable } from '@nestjs/common';
import {
  PostsInputModel,
  PostsInputModelForBlogs,
} from '../api/models/input/posts.input.model';
import { PostsQueryRepository } from './posts.query.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private connection: Repository<Post>,
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  async create(post: Post) {
    try {
      const newPost = await this.connection.save(post);
      return this.postsQueryRepository.getById(newPost.id); //todo
    } catch (err) {
      return null;
    }
  }
  async deleteById(id: string): Promise<boolean> {
    try {
      const deleteStatus = await this.connection.delete({ id: id });
      return !!deleteStatus.affected;
    } catch (err) {
      return false;
    }
  }
  async updateById(
    id: string,
    updateData: PostsInputModel | PostsInputModelForBlogs,
  ) {
    try {
      const updateResult = await this.connection.update(
        { id: id },
        {
          title: updateData.title,
          shortDescription: updateData.shortDescription,
          content: updateData.content,
        },
      );
      return !!updateResult.affected;
    } catch (err) {
      return false;
    }
  }
}
