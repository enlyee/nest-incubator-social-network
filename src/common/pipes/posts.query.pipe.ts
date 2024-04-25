import { Injectable, PipeTransform } from '@nestjs/common';
import {
  PostsQueryFixedModel,
  PostsQueryInputModel,
} from '../../features/posts/api/models/input/posts.input.model';
const sortingPostsName = [
  'id',
  'title',
  'shortDescription',
  'content',
  'blogName',
  'createdAt',
  'blogId',
];

@Injectable()
export class PostsQueryPipe implements PipeTransform {
  transform(query: PostsQueryInputModel): PostsQueryFixedModel {
    const fixedQuery: PostsQueryFixedModel = {
      sortBy: query.sortBy
        ? sortingPostsName.includes(query.sortBy)
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
