import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PostLike } from '../domain/posts-like.entity';
import { Model } from 'mongoose';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class PostsLikesQueryRepository {
  constructor(
    @InjectRepository(PostLike) private connection: Repository<PostLike>,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async getPostLikes(postId: string) {
    const reactions: any = await this.connection
      .createQueryBuilder('l')
      .select(`SUM(CASE WHEN status='Like' THEN 1 ELSE 0 END) as likes`)
      .addSelect(
        `SUM(CASE WHEN status='Dislike' THEN 1 ELSE 0 END) as dislikes`,
      )
      .where(`"postId" = :postId`, { postId: postId })
      .getRawOne();
    return reactions;
  }

  async getMyStatusForList(posts: string[], userId: string) {
    const likes = await this.connection.find({
      where: { postId: In(posts), userId: userId },
    });
    const statuses = likes.map((c: PostLike) => {
      return { postId: c.postId, status: c.status };
    });
    return statuses;
  }

  async getLastThreeLikes(postId: string) {
    const likes = await this.connection.find({
      where: { postId: postId, status: 'Like' },
      order: { addedAt: 'DESC' },
      take: 3,
    });
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
