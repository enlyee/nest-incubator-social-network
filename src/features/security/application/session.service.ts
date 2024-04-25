import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Session } from '../domain/session.entity';
import { SessionRepository } from '../infrastructure/session.repository';
import { DevicesOutputModel } from '../api/models/output/devices.output.model';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}
  async create(
    userId: string,
    deviceTitle: string,
    date: Date,
    ip: string,
    deviceId: string,
  ) {
    const session = new Session(userId, deviceTitle, date, ip, deviceId);
    await this.sessionRepository.create(session);
  }
  async update(sessionId: string, newTokenIssuing: Date) {
    return this.sessionRepository.updateDateById(sessionId, newTokenIssuing);
  }
  async deleteById(sessionId: string, userId: string) {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) return -1;
    if (session.userId !== userId) return 0;

    await this.sessionRepository.deleteById(sessionId);
    return 1;
  }
  async getAll(userId: string) {
    const sessions = await this.sessionRepository.getAll(userId);
    const mappedSessions = sessions.map((s) => new DevicesOutputModel(s));
    return mappedSessions;
  }
  async deleteAllExceptOne(userId: string, exceptedSession: string) {
    await this.sessionRepository.deleteAllExceptOne(userId, exceptedSession);
  }
  async _checkTokenActuality(sessionId: string, tokenIssuing: Date) {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) return false;
    if (session.lastActiveDate.toISOString() !== tokenIssuing.toISOString())
      return false;
    return true;
  }
}
