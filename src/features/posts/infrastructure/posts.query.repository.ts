import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { PostsOutputModel } from '../api/models/output/posts.output.model';
import { PostsQueryFixedModel } from '../api/models/input/posts.input.model';
import { PostsLikesQueryRepository } from '../../likes/infrostructure/posts-likes.query.repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private connection: Repository<Post>,
    private readonly postsLikesQueryRepository: PostsLikesQueryRepository,
  ) {}

  async isExists(id: string) {
    try {
      const post: Post | null = await this.connection.findOne({
        where: { id: id },
      });
      return !!post;
    } catch (err) {
      return false;
    }
  }

  async getById(id: string, userId: string | null = null) {
    try {
      const post: Post | null = await this.connection.findOne({
        relations: {
          blog: true,
        },
        where: { id: id },
      });
      console.log(post);
      if (!post) return false;
      const mapped = await this.mapToViewModel([post], userId);
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
      const blogFilter = blogId ? { blogId: blogId } : {};
      const sorting =
        query.sortBy === 'blogName'
          ? { blog: { name: query.sortDirection } }
          : { [query.sortBy]: query.sortDirection };
      const postsAndCount = await this.connection.findAndCount({
        relations: {
          blog: true,
        },
        where: [blogFilter],
        order: sorting,
        take: query.pageSize,
        skip: (query.pageNumber - 1) * query.pageSize,
      });
      const items = await this.mapToViewModel(postsAndCount[0], userId);
      return {
        pagesCount: Math.ceil(postsAndCount[1] / query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount: +postsAndCount[1],
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
        p.blog.name,
        +likes,
        +dislikes,
        status ? status.status : 'None',
        lastThreeLikes,
      );
    });
    return Promise.all(items);
  }
}
