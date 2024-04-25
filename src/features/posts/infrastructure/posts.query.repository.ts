import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { PostsOutputModel } from '../api/models/output/posts.output.model';
import { PostsQueryFixedModel } from '../api/models/input/posts.input.model';
import { PostsLikesQueryRepository } from '../../likes/infrostructure/posts-likes.query.repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private connection: DataSource,
    private readonly postsLikesQueryRepository: PostsLikesQueryRepository,
  ) {}

  async getById(id: string, userId: string | null = null) {
    try {
      const post: Post[] | null = await this.connection.query(
        `SELECT p.*, b."name" AS "blogName" FROM public."posts" p LEFT JOIN public."blogs" b ON p."blogId" = b."id" WHERE p."id" = $1`,
        [id],
      );
      if (!post[0]) return false;
      const mapped = await this.mapToViewModel([post[0]], userId);
      return mapped[0];
    } catch (err) {
      return false;
    }
  }

  async getAll(
    query: PostsQueryFixedModel,
    blogId: string | null = null,
    userId: string | null = null,
  ) {
    try {
      const blogFilter = blogId ? `WHERE p."blogId" = '${blogId}'` : '';
      const collectionSize = (
        await this.connection.query(
          `SELECT count(1) FROM public."posts" p ${blogFilter}`,
        )
      )[0].count;
      const posts: Post[] = await this.connection.query(
        `SELECT p.*, b."name" AS "blogName" FROM public."posts" p LEFT JOIN public."blogs" b ON p."blogId" = b."id" ${blogFilter} ORDER BY "${query.sortBy}" ${query.sortDirection} LIMIT ${query.pageSize} OFFSET ${(query.pageNumber - 1) * query.pageSize}`,
      ); //todo paramssssssss
      const items = await this.mapToViewModel(posts, userId);
      return {
        pagesCount: Math.ceil(collectionSize / query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount: +collectionSize,
        items: items,
      };
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private async mapToViewModel(posts: Post[], userId: string | undefined) {
    const postsId = posts.map((c: Post) => c.id);

    const statuses = userId
      ? await this.postsLikesQueryRepository.getMyStatusForList(postsId, userId)
      : null;

    const items = posts.map(async (p) => {
      const { likes, dislikes } =
        await this.postsLikesQueryRepository.getPostLikes(p.id);

      const lastThreeLikes =
        await this.postsLikesQueryRepository.getLastThreeLikes(p.id);
      const status = statuses ? statuses.find((s) => s.postId === p.id) : null;
      return new PostsOutputModel(
        p,
        p.blogName,
        +likes,
        +dislikes,
        status ? status.status : 'None',
        lastThreeLikes,
      );
    });
    return Promise.all(items);
  }
}
