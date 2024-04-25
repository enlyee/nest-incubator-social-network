import { Injectable } from '@nestjs/common';
import { Session } from '../domain/session.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionRepository {
  constructor(@InjectDataSource() private connection: DataSource) {}
  async create(session: Session) {
    await this.connection.query(
      `INSERT INTO public."sessions"("deviceId", "userId", "title", "lastActiveDate", "ip") VALUES ($1, $2, $3, $4, $5)`,
      [
        session.deviceId,
        session.userId,
        session.title,
        session.lastActiveDate,
        session.ip,
      ],
    );
  }

  //to query 1
  async getById(id: string) {
    try {
      const session: Session[] = await this.connection.query(
        `SELECT * FROM public."sessions" s WHERE s."deviceId" = $1`,
        [id],
      );
      return session[0];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  //to query 1
  async getAll(userId: string) {
    try {
      const session: Session[] = await this.connection.query(
        `SELECT * FROM public."sessions" s WHERE s."userId" = $1`,
        [userId],
      );
      return session;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async updateDateById(id: string, date: Date) {
    try {
      const status = await this.connection.query(
        `UPDATE public."sessions" SET "lastActiveDate" = $1 WHERE "deviceId" = $2;`,
        [date, id],
      );
      return !!status[1]; //to array length
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async deleteById(id: string) {
    try {
      const status = await this.connection.query(
        `DELETE FROM public."sessions" p WHERE p."deviceId" = $1`,
        [id],
      );
      return !!status[1]; //same
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async deleteAllExceptOne(userId: string, sessionId: string) {
    await this.connection.query(
      `DELETE FROM public."sessions" p WHERE (p."deviceId" <> $1 AND p."userId" = $2)`,
      [sessionId, userId],
    );
  }
}
