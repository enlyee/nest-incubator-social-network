import { Comment } from '../../../domain/comments.entity';

export class CommentsOutputModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None' | 'Like' | 'Dislike';
  };
  constructor(
    comment: Comment,
    userLogin: string,
    likesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: 'None' | 'Like' | 'Dislike';
    },
  ) {
    this.id = comment.id;
    this.content = comment.content;
    const commentatorInfo = {
      userId: comment.userId,
      userLogin: userLogin,
    };
    this.commentatorInfo = commentatorInfo;
    this.createdAt = comment.createdAt.toISOString();
    this.likesInfo = likesInfo;
  }
  //   1. get massive comments
  //   2. .map -> massive commentId
  //   3. massive commentLikes -> massive commentId ($in)
  //   4. massive userid -> massive user login
  //   5. connect comment userLogin
  //   6. connect /\ with lieks

  /*async map(comment: CommentDocument) {
    this.id = comment._id;
    this.content = comment.content;
    this.commentatorInfo.userId = comment.userId;
    this.commentatorInfo.userLogin = commentsRepo;
    this.createdAt = comment.createdAt.toISOString();
    this.likesInfo = {
      likesCount: commentsRepo,
      dislikesCount: commentsRepo,
      myStatus: commentsRepo,
    };
    return newComment;
  }*/
}

// export const CommentsOutputModelMapper = (
//   comment: CommentDocument,
// ): CommentsOutputModel => {
//   const newComment = new CommentsOutputModel(comment);
//   newComment.id = comment._id;
//   newComment.content = comment.content;
//   newComment.commentatorInfo.userId = comment.userId;
//   newComment.commentatorInfo.userLogin = commentsRepo;
//   newComment.createdAt = comment.createdAt.toISOString();
//   newComment.likesInfo = {
//     likesCount: commentsRepo,
//     dislikesCount: commentsRepo,
//     myStatus: commentsRepo,
//   };
//   return newComment;
// };
