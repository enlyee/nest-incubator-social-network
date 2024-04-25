import { Injectable } from '@nestjs/common';
import { BlogsInputModel } from '../api/models/input/blogs.input.model';
import { Blog } from '../domain/blogs.entity';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import {
  PostsInputModel,
  PostsInputModelForBlogs,
} from '../../posts/api/models/input/posts.input.model';
import { PostsService } from '../../posts/application/posts.service';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsService: PostsService,
  ) {}
  async create(blogData: BlogsInputModel) {
    const blog = new Blog(
      blogData.name,
      blogData.description,
      blogData.websiteUrl,
    );
    const newBlog = await this.blogsRepository.create(blog);
    return newBlog;
  }

  async updateById(id: string, blogData: BlogsInputModel) {
    const updatedBlog = await this.blogsRepository.updateById(id, blogData);
    return updatedBlog;
  }

  async deleteById(id: string) {
    const status = await this.blogsRepository.deleteById(id);
    return status;
  }

  async createPost(blogId: string, postData: PostsInputModelForBlogs) {
    const inputForPostService: PostsInputModel = {
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: blogId,
    };
    const post = await this.postsService.create(inputForPostService);
    return post;
  }
}
