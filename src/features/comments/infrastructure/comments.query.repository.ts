import { Injectable } from '@nestjs/common';
import { Comment } from '../domain/comments.entity';
import { CommentsOutputModel } from '../api/models/output/comments.output.model';
import { CommentsQueryFixedModel } from '../api/models/input/comments.query.input.model';
import { CommentsLikesQueryRepository } from '../../likes/infrostructure/comments-likes.query.repository';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { LikesInfoModel } from '../../likes/api/models/output/likes.input.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment) private connection: Repository<Comment>,
    private readonly commentsLikesQueryRepository: CommentsLikesQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  async isExists(id: string) {
    try {
      const comment: Comment | null = await this.connection.findOneBy({
        id: id,
      });
      return !!comment;
    } catch (err) {
      return false;
    }
  }

  async getById(id: string, userId: string | undefined = undefined) {
    try {
      const comment: Comment | null = await this.connection.findOneBy({
        id: id,
      });
      console.log(comment);
      if (!comment) return false;
      const mappedComment = await this.mapToViewModel([comment], userId);
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
    const commentsAndCount = await this.connection.findAndCount({
      where: { postId: postId },
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

    const items = commentsAndCount[0].length
      ? await this.mapToViewModel(commentsAndCount[0], userId)
      : [];

    return {
      pagesCount: Math.ceil(commentsAndCount[1] / query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +commentsAndCount[1],
      items: items,
    };
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
