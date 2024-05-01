import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/domain/users.entity';
import { Post } from '../../posts/domain/posts.entity';
import { CommentLike } from '../../likes/domain/comments-like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'character varying', collation: 'C' })
  content: string;
  @Column('timestamp with time zone')
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  userId: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;
  @Column()
  postId: string;

  @OneToMany(() => CommentLike, (like) => like.comment)
  likes: CommentLike[];

  static create(content: string, userId: string, postId: string) {
    const comment = new Comment();
    comment.id = crypto.randomUUID();
    comment.content = content;
    comment.userId = userId;
    comment.createdAt = new Date();
    comment.postId = postId;
    return comment;
  }
}
