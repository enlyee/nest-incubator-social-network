import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comments/domain/comments.entity';
import { Session } from '../../security/domain/session.entity';
import { CommentLike } from '../../likes/domain/comments-like.entity';
import { PostLike } from '../../likes/domain/posts-like.entity';
import { EmailConfirmation } from '../../auth/domain/email.confirmation.entity';

@Entity()
export class User /*extends BaseEntity*/ {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'character varying', collation: 'C' })
  login: string;
  @Column({ type: 'character varying', collation: 'C' })
  email: string;
  @Column('character varying')
  passwordHash: string;
  @Column('timestamp with time zone')
  createdAt: Date;
  @Column('boolean')
  isConfirmed: boolean;

  @OneToOne(() => EmailConfirmation, (confirmation) => confirmation.email)
  confirmation: EmailConfirmation;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
  commentLikes: CommentLike[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];

  static create(login: string, email: string, passwordHash: string) {
    const user = new User();
    user.id = crypto.randomUUID();
    user.login = login;
    user.email = email;
    user.passwordHash = passwordHash;
    user.createdAt = new Date();
    user.isConfirmed = false;
    return user;
  }
}
