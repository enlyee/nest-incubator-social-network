export class Session {
  deviceId: string; //session(device) id
  userId: string;
  title: string;
  lastActiveDate: Date; //куаукы
  ip: string; //куаукы
  constructor(
    userId: string,
    title: string,
    date: Date,
    ip: string,
    deviceId: string,
  ) {
    this.userId = userId;
    this.title = title;
    this.lastActiveDate = date;
    this.ip = ip;
    this.deviceId = deviceId;
  }
}
