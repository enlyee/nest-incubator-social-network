import { Injectable, PipeTransform } from '@nestjs/common';
import {
  CommentsQueryFixedModel,
  CommentsQueryInputModel,
} from '../../features/comments/api/models/input/comments.query.input.model';

const sortingCommentsName = ['createdAt', 'content', 'likes'];

@Injectable()
export class CommentsQueryPipe implements PipeTransform {
  transform(query: CommentsQueryInputModel): CommentsQueryFixedModel {
    const fixedQuery: CommentsQueryFixedModel = {
      sortBy: query.sortBy
        ? sortingCommentsName.includes(query.sortBy)
          ? query.sortBy
          : 'createdAt'
        : 'createdAt',
      sortDirection: query.sortDirection === 'asc' ? 'asc' : 'desc',
      pageNumber:
        query.pageNumber && query.pageNumber > 0 && query.pageNumber % 1 === 0
          ? query.pageNumber
          : 1,
      pageSize:
        query.pageSize && query.pageSize > 0 && query.pageSize % 1 === 0
          ? query.pageSize
          : 10,
    };

    return fixedQuery;
  }
}
