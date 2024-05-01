import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/domain/users.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  deviceId: string; //session(device) id
  @Column('character varying')
  title: string;
  @Column('timestamp with time zone')
  lastActiveDate: Date;
  @Column('character varying')
  ip: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  static create(
    userId: string,
    title: string,
    date: Date,
    ip: string,
    deviceId: string,
  ) {
    const session = new Session();
    session.userId = userId;
    session.title = title;
    session.lastActiveDate = date;
    session.ip = ip;
    session.deviceId = deviceId;
    return session;
  }
}
