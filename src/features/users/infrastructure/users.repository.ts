import { User } from '../domain/users.entity';
import { UsersOutputModelMapper } from '../api/models/output/users.output.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Or, Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private connection: Repository<User>) {}
  async createUser(user: User) {
    try {
      const result: User = await this.connection.save(user);
      return UsersOutputModelMapper(result); //todo pochemu mapping
    } catch (err) {
      return null;
    }
  }
  async delete(id: string) {
    try {
      const result = await this.connection.delete({ id: id });
      return !!result.affected;
    } catch (err) {
      return null;
    }
  }
  async getAllUserDataByLoginOrEmail(loginOrEmail: string) {
    try {
      const user: User | null = await this.connection.findOne({
        where: [{ login: loginOrEmail }, { email: loginOrEmail }],
      });
      if (!user) return null;
      return user;
    } catch (err) {
      return null;
    }
  }

  async confirmUser(email: string) {
    await this.connection.update({ email: email }, { isConfirmed: true });
  }
}
