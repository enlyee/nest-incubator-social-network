import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PostsLike } from '../domain/posts-like.entity';
import { Model } from 'mongoose';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsLikesQueryRepository {
  constructor(
    @InjectDataSource() private connection: DataSource,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async getPostLikes(postId: string) {
    const reactions = await this.connection.query(
      `SELECT (SELECT count(1) FROM public."postsLikes" WHERE "postId" = $1 AND status = 'Like') AS likes, (SELECT count(1) FROM public."postsLikes" WHERE "postId" = $1 AND status = 'Dislike') AS dislikes`,
      [postId],
    );
    return reactions[0];
  }

  async getMyStatusForList(posts: string[], userId: string) {
    const likes: PostsLike[] = await this.connection.query(
      `SELECT * FROM public."postsLikes" WHERE "postId" =ANY ($1) AND "userId" = $2`,
      [posts, userId],
    );
    const statuses = likes.map((c: PostsLike) => {
      return { postId: c.postId, status: c.status };
    });
    return statuses;
  }

  async getLastThreeLikes(postId: string) {
    const likes = await this.connection.query(
      `SELECT * FROM public."postsLikes" WHERE "postId" = $1 AND "status" = 'Like' ORDER BY "addedAt" DESC LIMIT 3`,
      [postId],
    );
    if (likes.length === 0) return [];
    const usersId = likes.map((l) => l.userId);
    const usernames =
      await this.usersQueryRepository.getUsernamesByList(usersId);
    const lastThree = likes.map((l) => {
      const login = usernames.find((u) => u.userId === l.userId);
      return {
        addedAt: l.addedAt.toISOString(),
        userId: l.userId,
        login: login.username,
      };
    });
    return lastThree;
  }
}
