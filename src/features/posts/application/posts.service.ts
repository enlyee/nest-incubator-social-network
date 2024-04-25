import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { PostsRepository } from '../infrastructure/posts.repository';
import {
  PostsInputModel,
  PostsInputModelForBlogs,
} from '../api/models/input/posts.input.model';
import { Post } from '../domain/posts.entity';
import { Injectable } from '@nestjs/common';
import { PostsOutputModel } from '../api/models/output/posts.output.model';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async create(postData: PostsInputModel) {
    const blog = await this.blogsQueryRepository.getBlogById(postData.blogId);
    if (!blog) return false;
    const post = new Post(postData);
    const newPost = await this.postsRepository.create(post);
    return newPost;
  }

  async deleteById(id: string, blogId: string = null) {
    const blogIsExists = blogId
      ? !!(await this.blogsQueryRepository.getBlogById(blogId))
      : true;
    if (!blogIsExists) return false;
    const status = await this.postsRepository.deleteById(id);
    return status;
  }

  async updateById(
    id: string,
    updateData: PostsInputModel | PostsInputModelForBlogs,
    blogId: string = null,
  ) {
    const blogIsExists = blogId
      ? !!(await this.blogsQueryRepository.getBlogById(blogId))
      : true;
    if (!blogIsExists) return false;
    return this.postsRepository.updateById(id, updateData);
  }
}
