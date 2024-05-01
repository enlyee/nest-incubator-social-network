import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { CommentsLikesRepository } from '../infrostructure/comments-likes.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsLikesService {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentsLikesRepository: CommentsLikesRepository,
  ) {}
  async like(
    commentId: string,
    userId: string,
    status: 'Like' | 'Dislike' | 'None',
  ) {
    const comment = await this.commentsQueryRepository.isExists(commentId);
    if (!comment) return false;
    await this.commentsLikesRepository.likeComment(userId, status, commentId);
    return true;
  }
}
