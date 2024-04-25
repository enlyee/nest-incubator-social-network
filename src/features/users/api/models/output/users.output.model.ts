import { User } from '../../../domain/users.entity';

export class UsersOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class UsersOutputModelWithQuery {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersOutputModel[];
}

export class UsersProfileModel {
  email: string;
  login: string;
  userId: string;
}

export const UsersOutputModelMapper = (user: User): UsersOutputModel => {
  const output = new UsersOutputModel();
  output.id = user.id;
  output.login = user.login;
  output.email = user.email;
  output.createdAt = user.createdAt.toISOString();
  return output;
};

export const UsersProfileModelMapper = (user: User): UsersProfileModel => {
  const output = new UsersProfileModel();
  output.userId = user.id;
  output.login = user.login;
  output.email = user.email;
  return output;
};
