import { User } from '../domain/users.entity';
import { UsersOutputModelMapper } from '../api/models/output/users.output.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private connection: DataSource) {}
  async createUser(user: User) {
    try {
      const result: User[] = await this.connection.query(
        `INSERT INTO public."users" ("id", "login", "email", "passwordHash", "createdAt", "isConfirmed") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [
          user.id,
          user.login,
          user.email,
          user.passwordHash,
          user.createdAt,
          user.isConfirmed,
        ],
      );
      return UsersOutputModelMapper(result[0]); //todo pochemu mapping
    } catch (err) {
      return null;
    }
  }
  async delete(id: string) {
    try {
      const result = await this.connection.query(
        `DELETE FROM public."users" u WHERE u."id" = $1`,
        [id],
      );
      return !!result[1];
    } catch (err) {
      return null;
    }
  }
  async getAllUserDataByLoginOrEmail(loginOrEmail: string) {
    try {
      const user: User[] | null = await this.connection.query(
        `SELECT * FROM public."users" u WHERE u."login" = $1 or u."email" = $1`,
        [loginOrEmail],
      );
      if (!user[0]) return null;
      return user[0];
    } catch (err) {
      return null;
    }
  }

  async confirmUser(email: string) {
    await this.connection.query(
      `UPDATE public."users" SET "isConfirmed" = true WHERE "email" = $1`,
      [email],
    );
  }
}
