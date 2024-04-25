import { BlogsQueryFixedModel } from '../api/models/input/blogs.query.input.model';
import { Injectable } from '@nestjs/common';
import { Blog } from '../domain/blogs.entity';
import { BlogsOutputModelMapper } from '../api/models/output/blogs.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private connection: DataSource) {}
  async getBlogs(query: BlogsQueryFixedModel) {
    try {
      const collectionSize = (
        await this.connection.query(
          `SELECT count(1) FROM public."blogs" b WHERE b."name" ILIKE '%${query.searchNameTerm}%'`, //vlad tut prankanul
        )
      )[0].count;
      const blogs: Blog[] = await this.connection.query(
        `SELECT * FROM public."blogs" b WHERE b."name" ILIKE '%${query.searchNameTerm}%' ORDER BY b."${query.sortBy}" ${query.sortDirection} LIMIT ${query.pageSize} OFFSET ${(query.pageNumber - 1) * query.pageSize}`,
      ); //todo PARAMETRIIIIIIIIII
      return {
        pagesCount: Math.ceil(collectionSize / query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount: +collectionSize,
        items: blogs.map(BlogsOutputModelMapper),
      };
    } catch (err) {
      return null;
    }
  }

  async getBlogById(id: string) {
    try {
      const blog: Blog[] = await this.connection.query(
        `SELECT * FROM public."blogs" b WHERE b."id" = $1`,
        [id],
      );
      if (!blog[0]) return false;
      return BlogsOutputModelMapper(blog[0]);
    } catch (err) {
      return false;
    }
  }
}
