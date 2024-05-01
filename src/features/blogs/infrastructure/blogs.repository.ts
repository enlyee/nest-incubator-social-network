import { Injectable } from '@nestjs/common';
import { BlogsInputModel } from '../api/models/input/blogs.input.model';
import {
  BlogsOutputModel,
  BlogsOutputModelMapper,
} from '../api/models/output/blogs.output.model';
import { Blog } from '../domain/blogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(@InjectRepository(Blog) private connection: Repository<Blog>) {}
  async create(blogData: Blog): Promise<BlogsOutputModel> {
    const blog = await this.connection.save(blogData);
    return BlogsOutputModelMapper(blog);
  }

  async updateById(id: string, blogData: BlogsInputModel): Promise<boolean> {
    const updateStatus = await this.connection.update(
      { id: id },
      {
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
      },
    );
    return !!updateStatus.affected;
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteStatus = await this.connection.delete({ id: id });
    return !!deleteStatus.affected;
  }
}
