import { Injectable } from '@nestjs/common';
import { PostsLike } from '../domain/posts-like.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsLikesRepository {
  constructor(@InjectDataSource() private connection: DataSource) {}

  async like(
    postId: string,
    userId: string,
    status: 'Like' | 'Dislike' | 'None',
  ) {
    const state = await this.connection.query(
      `UPDATE public."postsLikes" SET status = $1 WHERE "postId" = $2 AND "userId" = $3`,
      [status, postId, userId],
    );

    console.log(state + 'conslog');

    if (!state[1]) {
      const like = new PostsLike(userId, postId, status);
      await this.connection.query(
        `INSERT INTO public."postsLikes" ("userId", "postId", status, "addedAt") VALUES ($1, $2, $3, $4);`,
        [like.userId, like.postId, like.status, like.addedAt],
      );
      return;
    }
    return;
  }
}
