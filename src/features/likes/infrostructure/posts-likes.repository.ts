import { Injectable } from '@nestjs/common';
import { PostLike } from '../domain/posts-like.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostsLikesRepository {
  constructor(
    @InjectRepository(PostLike) private connection: Repository<PostLike>,
  ) {}

  async like(
    postId: string,
    userId: string,
    status: 'Like' | 'Dislike' | 'None',
  ) {
    const state = await this.connection.update(
      { postId: postId, userId: userId },
      { status: status },
    );

    if (!state.affected) {
      const like = PostLike.create(userId, postId, status);
      await this.connection.save(like);
      return;
    }
    return;
  }
}
