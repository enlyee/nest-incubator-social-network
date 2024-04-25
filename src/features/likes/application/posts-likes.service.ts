import { Injectable } from '@nestjs/common';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { PostsLikesRepository } from '../infrostructure/posts-likes.repository';

@Injectable()
export class PostsLikesService {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsLikesRepository: PostsLikesRepository,
  ) {}
  async like(
    postId: string,
    userId: string,
    status: 'Like' | 'Dislike' | 'None',
  ) {
    const post = await this.postsQueryRepository.getById(postId);
    if (!post) return false;
    await this.postsLikesRepository.like(postId, userId, status);
    return true;
  }
}
