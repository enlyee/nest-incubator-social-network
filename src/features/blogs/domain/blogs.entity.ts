import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/domain/posts.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'character varying', collation: 'C' })
  name: string;
  @Column('character varying')
  description: string;
  @Column('character varying')
  websiteUrl: string;
  @Column('timestamp with time zone')
  createdAt: Date;
  @Column('boolean')
  isMembership: boolean;

  @OneToMany(() => Post, (post) => post.blog)
  posts: Post[];

  static create(name: string, description: string, websiteUrl: string) {
    const blog = new Blog();
    blog.id = crypto.randomUUID();
    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.createdAt = new Date();
    blog.isMembership = false;
    return blog;
  }
}
