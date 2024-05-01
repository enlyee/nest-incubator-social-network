import { BlogsQueryFixedModel } from '../api/models/input/blogs.query.input.model';
import { Injectable } from '@nestjs/common';
import { Blog } from '../domain/blogs.entity';
import { BlogsOutputModelMapper } from '../api/models/output/blogs.output.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectRepository(Blog) private connection: Repository<Blog>) {}
  async getBlogs(query: BlogsQueryFixedModel) {
    try {
      const blogsAndSize = await this.connection.findAndCount({
        where: {
          name: ILike(`%${query.searchNameTerm}%`),
        },
        order: { [query.sortBy]: query.sortDirection },
        take: query.pageSize,
        skip: (query.pageNumber - 1) * query.pageSize,
      });
      return {
        pagesCount: Math.ceil(blogsAndSize[1] / query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount: +blogsAndSize[1],
        items: blogsAndSize[0].map(BlogsOutputModelMapper),
      };
    } catch (err) {
      return null;
    }
  }

  async getBlogById(id: string) {
    try {
      const blog: Blog | null = await this.connection.findOneBy({ id: id });
      if (!blog) return false;
      return BlogsOutputModelMapper(blog);
    } catch (err) {
      return false;
    }
  }
}
