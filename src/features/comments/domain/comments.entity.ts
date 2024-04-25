export class Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  postId: string;

  constructor(content: string, userId: string, postId: string) {
    this.id = crypto.randomUUID();
    this.content = content;
    this.userId = userId;
    this.createdAt = new Date();
    this.postId = postId;
  }
}
