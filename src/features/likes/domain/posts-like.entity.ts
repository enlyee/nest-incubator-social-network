import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/domain/posts.entity';
import { User } from '../../users/domain/users.entity';

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('character varying')
  status: 'None' | 'Like' | 'Dislike';
  @Column('timestamp with time zone')
  addedAt: Date;

  @ManyToOne(() => Post, (post) => post.likes)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  postId: string;

  @ManyToOne(() => User, (user) => user.postLikes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  static create(
    userId: string,
    postId: string,
    status: 'None' | 'Like' | 'Dislike',
  ) {
    const like = new PostLike();
    like.id = crypto.randomUUID();
    like.postId = postId;
    like.status = status;
    like.userId = userId;
    like.addedAt = new Date();
    return like;
  }
}
