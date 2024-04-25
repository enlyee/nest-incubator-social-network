import { Post } from '../domain/posts.entity';
import { PostsOutputModel } from '../api/models/output/posts.output.model';
import { Injectable } from '@nestjs/common';
import {
  PostsInputModel,
  PostsInputModelForBlogs,
} from '../api/models/input/posts.input.model';
import { PostsQueryRepository } from './posts.query.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() private connection: DataSource,
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  async create(post: Post) {
    try {
      const newPost: Post[] = await this.connection.query(
        `INSERT INTO public.posts(id, title, "shortDescription", content, "blogId", "createdAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [
          post.id,
          post.title,
          post.shortDescription,
          post.content,
          post.blogId,
          post.createdAt,
        ],
      );
      return this.postsQueryRepository.getById(newPost[0].id);
    } catch (err) {
      return null;
    }
  }
  async deleteById(id: string): Promise<boolean> {
    try {
      const postDeleting = await this.connection.query(
        `DELETE FROM public."posts" p WHERE p."id" = $1`,
        [id],
      );
      return !!postDeleting[1];
    } catch (err) {
      return false;
    }
  }
  async updateById(
    id: string,
    updateData: PostsInputModel | PostsInputModelForBlogs,
  ) {
    try {
      const updateResult = await this.connection.query(
        `UPDATE public.posts SET title=$1, "shortDescription"=$2, content=$3 WHERE "id" = $4;`,
        [updateData.title, updateData.shortDescription, updateData.content, id],
      );
      return !!updateResult[1];
    } catch (err) {
      return false;
    }
  }
}
