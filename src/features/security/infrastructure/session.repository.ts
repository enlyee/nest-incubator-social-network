import { Injectable } from '@nestjs/common';
import { Session } from '../domain/session.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { And, DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session) private connection: Repository<Session>,
  ) {}
  async create(session: Session) {
    await this.connection.save(session);
  }

  //to query 1
  async getById(id: string) {
    try {
      const session: Session = await this.connection.findOneBy({
        deviceId: id,
      });
      return session;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  //to query 1
  async getAll(userId: string) {
    try {
      const sessions = await this.connection.findBy({ userId: userId });
      return sessions;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async updateDateById(id: string, date: Date) {
    try {
      const status = await this.connection.update(
        { deviceId: id },
        { lastActiveDate: date },
      );
      return !!status.affected;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async deleteById(id: string) {
    try {
      const status = await this.connection.delete({ deviceId: id });
      return !!status.affected; //same
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async deleteAllExceptOne(userId: string, sessionId: string) {
    await this.connection.delete({ deviceId: Not(sessionId), userId: userId });
  }
}
