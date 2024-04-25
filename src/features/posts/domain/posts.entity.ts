import { PostsInputModel } from '../api/models/input/posts.input.model';

export class Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;

  constructor(postCreateData: PostsInputModel) {
    this.id = crypto.randomUUID();
    this.title = postCreateData.title;
    this.shortDescription = postCreateData.shortDescription;
    this.content = postCreateData.content;
    this.blogId = postCreateData.blogId;
    this.createdAt = new Date();
  }
}
