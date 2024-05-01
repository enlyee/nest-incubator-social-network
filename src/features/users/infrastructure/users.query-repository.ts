import { Injectable } from '@nestjs/common';
import { UsersQueryFixedModel } from '../api/models/input/users.query.input.model';
import { User } from '../domain/users.entity';
import {
  UsersOutputModelMapper,
  UsersOutputModelWithQuery,
  UsersProfileModelMapper,
} from '../api/models/output/users.output.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, In, Like, Or, Repository } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(User) private connection: Repository<User>) {}
  async getAll(
    query: UsersQueryFixedModel,
  ): Promise<UsersOutputModelWithQuery> {
    const users = await this.connection.findAndCount({
      where: [
        { login: ILike(`%${query.searchLoginTerm}%`) },
        { email: ILike(`%${query.searchEmailTerm}%`) },
      ],
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

    return {
      pagesCount: Math.ceil(users[1] / query.pageSize), //todo
      page: +query.pageNumber, //todo
      pageSize: +query.pageSize, //todo
      totalCount: +users[1], //todo
      items: users[0].map(UsersOutputModelMapper), // to entity
    };
  }

  async getProfileById(id: string) {
    const user = await this.connection.findOneBy({ id: id });
    if (!user) return null;
    return UsersProfileModelMapper(user);
  }

  async getUsernamesByList(ids: string[]) {
    const users: User[] = await this.connection.findBy({ id: In(ids) });
    const usernames = users.map((u) => {
      return { userId: u.id, username: u.login };
    });
    return usernames;
  }
}
