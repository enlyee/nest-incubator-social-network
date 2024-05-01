import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/domain/users.entity';
import { Comment } from '../../comments/domain/comments.entity';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('character varying')
  status: 'None' | 'Like' | 'Dislike';

  @ManyToOne(() => User, (user) => user.commentLikes)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  userId: string;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
  @Column()
  commentId: string;

  static create(
    userId: string,
    commentId: string,
    status: 'None' | 'Like' | 'Dislike',
  ) {
    const like = new CommentLike();
    like.id = crypto.randomUUID();
    like.commentId = commentId;
    like.status = status;
    like.userId = userId;
    return like;
  }
}
