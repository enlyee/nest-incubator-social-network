export class CommentsLike {
  userId: string;
  commentId: string;
  status: 'None' | 'Like' | 'Dislike';

  constructor(
    userId: string,
    commentId: string,
    status: 'None' | 'Like' | 'Dislike',
  ) {
    this.commentId = commentId;
    this.status = status;
    this.userId = userId;
  }
}
