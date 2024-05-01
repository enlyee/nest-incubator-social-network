import { add } from 'date-fns/add';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/domain/users.entity';

@Entity()
export class EmailConfirmation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('timestamp with time zone')
  expiredIn: Date;
  @Column('character varying')
  email: string;

  @OneToOne(() => User, (user) => user.confirmation)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  constructor(email: string, userId: string) {
    this.id = crypto.randomUUID();
    this.expiredIn = add(new Date(), { minutes: 10 });
    this.email = email;
    this.userId = userId;
  }
}
