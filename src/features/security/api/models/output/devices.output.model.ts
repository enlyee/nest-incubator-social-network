import { Session } from '../../../domain/session.entity';

export class DevicesOutputModel {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  constructor(sessionDb: Session) {
    this.ip = sessionDb.ip;
    this.title = sessionDb.title;
    this.lastActiveDate = sessionDb.lastActiveDate.toISOString();
    this.deviceId = sessionDb.deviceId;
  }
}
