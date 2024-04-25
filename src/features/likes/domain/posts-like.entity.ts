export class PostsLike {
  userId: string;
  postId: string;
  status: 'None' | 'Like' | 'Dislike';
  addedAt: Date;

  constructor(
    userId: string,
    postId: string,
    status: 'None' | 'Like' | 'Dislike',
  ) {
    this.postId = postId;
    this.status = status;
    this.userId = userId;
    this.addedAt = new Date();
  }
}
