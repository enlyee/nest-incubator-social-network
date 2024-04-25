import { Injectable, PipeTransform } from '@nestjs/common';
import {
  BlogsQueryFixedModel,
  BlogsQueryInputModel,
} from '../../features/blogs/api/models/input/blogs.query.input.model';

const sortingBlogsName = ['id', 'name', 'description', 'createdAt'];

@Injectable()
export class BlogsQueryPipe implements PipeTransform {
  transform(query: BlogsQueryInputModel): BlogsQueryFixedModel {
    const fixedQuery: BlogsQueryFixedModel = {
      sortBy: query.sortBy
        ? sortingBlogsName.includes(query.sortBy)
          ? query.sortBy
          : 'createdAt'
        : 'createdAt',
      sortDirection: query.sortDirection === 'asc' ? 'ASC' : 'DESC',
      pageNumber:
        query.pageNumber && query.pageNumber > 0 && query.pageNumber % 1 === 0
          ? query.pageNumber
          : 1,
      pageSize:
        query.pageSize && query.pageSize > 0 && query.pageSize % 1 === 0
          ? query.pageSize
          : 10,
      searchNameTerm: query.searchNameTerm || '',
    };

    return fixedQuery;
  }
}
