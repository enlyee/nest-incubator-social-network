import { Injectable } from '@nestjs/common';
import { Comment } from '../domain/comments.entity';
import { CommentsOutputModel } from '../api/models/output/comments.output.model';
import { CommentsQueryFixedModel } from '../api/models/input/comments.query.input.model';
import { CommentsLikesQueryRepository } from '../../likes/infrostructure/comments-likes.query.repository';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { LikesInfoModel } from '../../likes/api/models/output/likes.input.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() private connection: DataSource,
    private readonly commentsLikesQueryRepository: CommentsLikesQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  async getById(id: string, userId: string | undefined = undefined) {
    try {
      const comment: Comment[] | null = await this.connection.query(
        `SELECT * FROM public.comments WHERE id=$1`,
        [id],
      );
      if (!comment[0]) return false;
      const mappedComment = await this.mapToViewModel([comment[0]], userId);
      return mappedComment[0];
    } catch (err) {
      return false;
    }
  }

  async getAllComments(
    postId: string,
    query: CommentsQueryFixedModel,
    userId: string = null,
  ) {
    const collectionSize = (
      await this.connection.query(
        `SELECT count(*) FROM public.comments WHERE "postId"=$1`,
        [postId],
      )
    )[0].count;

    const comments: Comment[] = await this.getCommentsDbTypeQuery(
      query,
      postId,
    );

    const items = comments[0]
      ? await this.mapToViewModel(comments, userId)
      : [];

    return {
      pagesCount: Math.ceil(collectionSize / query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +collectionSize,
      items: items,
    };
  }
  private async getCommentsDbTypeQuery(
    query: CommentsQueryFixedModel,
    postId: string,
  ) {
    console.log(query);
    return this.connection.query(
      `SELECT * FROM public.comments WHERE "postId"=$1 ORDER BY "${query.sortBy}" ${query.sortDirection} LIMIT $2 OFFSET $3`,
      [postId, query.pageSize, (query.pageNumber - 1) * query.pageSize],
    );
  }
  private async mapToViewModel(comments: Comment[], userId: string | null) {
    const commentsId = comments.map((c: Comment) => c.id);

    const statuses = userId
      ? await this.commentsLikesQueryRepository.getMyStatusForList(
          commentsId,
          userId,
        )
      : null;

    const usersId = comments.map((c: Comment) => c.userId);

    const userNames =
      await this.usersQueryRepository.getUsernamesByList(usersId);

    const mappedComments = comments.map(async (c) => {
      const userInfo = userNames.find((u) => u.userId === c.userId);
      const { dislikes, likes } =
        await this.commentsLikesQueryRepository.getLikesInfo(c.id);
      const status = statuses
        ? statuses.find((s) => s.commentId === c.id)
        : null;
      const likesInfo: LikesInfoModel = {
        likesCount: +likes,
        dislikesCount: +dislikes,
        myStatus: status ? status.status : 'None',
      };
      return new CommentsOutputModel(c, userInfo.username, likesInfo);
    });

    return Promise.all(mappedComments);
  }
}
