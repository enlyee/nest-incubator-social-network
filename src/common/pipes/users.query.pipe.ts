import { Injectable, PipeTransform } from '@nestjs/common';
import {
  UsersQueryFixedModel,
  UsersQueryInputModel,
} from '../../features/users/api/models/input/users.query.input.model';
const sortingUsersName = ['login', 'email', 'createdAt'];

@Injectable()
export class UsersQueryPipe implements PipeTransform {
  transform(query: UsersQueryInputModel): UsersQueryFixedModel {
    const fixedQuery: UsersQueryFixedModel = {
      sortBy: query.sortBy
        ? sortingUsersName.includes(query.sortBy)
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
      searchLoginTerm: query.searchLoginTerm || '',
      searchEmailTerm: query.searchEmailTerm || '',
    };

    return fixedQuery;
  }
}
