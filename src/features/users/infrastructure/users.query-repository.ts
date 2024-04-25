import { Injectable } from '@nestjs/common';
import { UsersQueryFixedModel } from '../api/models/input/users.query.input.model';
import { User } from '../domain/users.entity';
import {
  UsersOutputModelMapper,
  UsersOutputModelWithQuery,
  UsersProfileModelMapper,
} from '../api/models/output/users.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private connection: DataSource) {}
  async getAll(
    query: UsersQueryFixedModel,
  ): Promise<UsersOutputModelWithQuery> {
    const collectionSize: { count: number }[] = await this.connection.query(
      `SELECT count(1) FROM public."users" u WHERE (u."login" ILIKE '%${query.searchLoginTerm}%' OR u."email" ILIKE '%${query.searchEmailTerm}%')`,
    );

    const users: User[] = await this.connection.query(
      `SELECT * FROM public."users" u WHERE (u."login" ILIKE '%${query.searchLoginTerm}%' OR u."email" ILIKE '%${query.searchEmailTerm}%') ORDER BY u."${query.sortBy}" ${query.sortDirection} LIMIT ${query.pageSize} OFFSET ${(query.pageNumber - 1) * query.pageSize}`,
    ); //todo pARMARMRAMMREAMRMMRAMRMAMRM

    return {
      pagesCount: Math.ceil(collectionSize[0].count / query.pageSize), //todo
      page: +query.pageNumber, //todo
      pageSize: +query.pageSize, //todo
      totalCount: +collectionSize[0].count, //todo
      items: users.map(UsersOutputModelMapper), // to entity
    };
  }

  async getProfileById(id: string) {
    const user: User[] | null = await this.connection.query(
      `SELECT * FROM public."users" u WHERE u."id" = $1`,
      [id],
    );
    if (!user) return null;
    return UsersProfileModelMapper(user[0]);
  }

  async getUsernamesByList(ids: string[]) {
    const users: User[] = await this.connection.query(
      `SELECT * FROM public."users" u WHERE u."id" =ANY ($1)`,
      [ids],
    );
    const usernames = users.map((u) => {
      return { userId: u.id, username: u.login };
    });
    return usernames;
  }
}
