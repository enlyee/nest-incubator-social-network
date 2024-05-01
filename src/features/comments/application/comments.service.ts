import { Injectable } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { Comment } from '../domain/comments.entity';
import { CommentsOutputModel } from '../api/models/output/comments.output.model';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  async delete(commentId: string, userId: string) {
    const comment = await this.commentsQueryRepository.getById(commentId);
    if (!comment) return -1;
    if (comment.commentatorInfo.userId !== userId) return 0;
    return await this.commentsRepository.deleteById(commentId);
  }

  async update(commentId: string, userId: string, content: string) {
    const comment = await this.commentsQueryRepository.getById(commentId);
    if (!comment) return -1;
    if (comment.commentatorInfo.userId !== userId) return 0;
    return await this.commentsRepository.updateById(commentId, content);
  }

  async create(userId: string, postId: string, content: string) {
    const post = await this.postsQueryRepository.isExists(postId);
    if (!post) return false;
    const comment = Comment.create(content, userId, postId);
    const newComment: Comment = await this.commentsRepository.create(comment);
    const userInfo = await this.usersQueryRepository.getProfileById(userId);
    return new CommentsOutputModel(newComment, userInfo.login, {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    });
  }
}
