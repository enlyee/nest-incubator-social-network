import { UserCreateModel } from '../api/models/input/users.input.model';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from '../domain/users.entity';
import * as bcrypt from 'bcryptjs';
import { UsersOutputModel } from '../api/models/output/users.output.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async createUser(userData: UserCreateModel) {
    const passwordHash = await this._createHash(userData.password);
    const user = new User(userData.login, userData.email, passwordHash);
    const result: UsersOutputModel = await this.userRepository.createUser(user);
    return result;
  }
  async deleteUser(id: string) {
    const result: boolean = await this.userRepository.delete(id);
    return result;
  }
  private async _createHash(data: string) {
    return bcrypt.hash(data, 10);
  }
}
