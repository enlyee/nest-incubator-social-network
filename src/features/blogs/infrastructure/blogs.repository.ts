import { Injectable } from '@nestjs/common';
import { BlogsInputModel } from '../api/models/input/blogs.input.model';
import {
  BlogsOutputModel,
  BlogsOutputModelMapper,
} from '../api/models/output/blogs.output.model';
import { Blog } from '../domain/blogs.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private connection: DataSource) {}
  async create(blogData: Blog): Promise<BlogsOutputModel> {
    const blog: Blog[] = await this.connection.query(
      `INSERT INTO public."blogs"( "id", "name", "description", "websiteUrl", "createdAt", "isMembership") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        blogData.id,
        blogData.name,
        blogData.description,
        blogData.websiteUrl,
        blogData.createdAt,
        blogData.isMembership,
      ],
    );
    return BlogsOutputModelMapper(blog[0]);
  }

  async updateById(id: string, blogData: BlogsInputModel): Promise<boolean> {
    const updateStatus = await this.connection.query(
      `UPDATE public."blogs" SET "name"=$1, "description"=$2, "websiteUrl"=$3 WHERE "id" = $4;`,
      [blogData.name, blogData.description, blogData.websiteUrl, id],
    );
    return !!updateStatus[1];
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteStatus = await this.connection.query(
      `DELETE FROM public.blogs b WHERE b."id" = $1;`,
      [id],
    );
    return !!deleteStatus[1];
  }
}
