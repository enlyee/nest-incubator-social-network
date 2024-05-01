import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.entity';
import { PostsInputModel } from '../api/models/input/posts.input.model';
import { Comment } from '../../comments/domain/comments.entity';
import { PostLike } from '../../likes/domain/posts-like.entity';

@Entity('post')
export class Post {
  @PrimaryColumn('uuid')
  id: string;
  @Column({ type: 'character varying', collation: 'C' })
  title: string;
  @Column({ type: 'character varying', collation: 'C' })
  shortDescription: string;
  @Column({ type: 'character varying', collation: 'C' })
  content: string;
  @Column('timestamp with time zone')
  createdAt: Date;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;
  @Column()
  blogId: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  static create(postCreateData: PostsInputModel) {
    const newPost = new Post();
    newPost.id = crypto.randomUUID();
    newPost.title = postCreateData.title;
    newPost.shortDescription = postCreateData.shortDescription;
    newPost.content = postCreateData.content;
    newPost.createdAt = new Date();
    newPost.blogId = postCreateData.blogId;
    return newPost;
  }
}
