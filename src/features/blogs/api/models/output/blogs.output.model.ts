import { Blog } from '../../../domain/blogs.entity';

export class BlogsOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export const BlogsOutputModelMapper = (newBlog: Blog): BlogsOutputModel => {
  const blog = new BlogsOutputModel();
  blog.id = newBlog.id;
  blog.name = newBlog.name;
  blog.description = newBlog.description;
  blog.websiteUrl = newBlog.websiteUrl;
  blog.createdAt = newBlog.createdAt.toISOString();
  blog.isMembership = newBlog.isMembership;
  return blog;
};
