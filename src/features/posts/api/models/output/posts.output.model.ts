import { Post } from '../../../domain/posts.entity';

export class PostsOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'Like' | 'Dislike' | 'None';
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };

  constructor(
    post: Post,
    blogName: string,
    likes: number,
    dislikes: number,
    status: 'Like' | 'Dislike' | 'None',
    newestLikes: { addedAt: string; userId: string; login: string }[],
  ) {
    this.id = post.id;
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId;
    this.blogName = blogName;
    this.createdAt = post.createdAt.toISOString();
    this.extendedLikesInfo = {
      likesCount: likes,
      dislikesCount: dislikes,
      myStatus: status,
      newestLikes: newestLikes,
    };
  }
}

/*
export const PostsOutputModelMapper = (
  post: PostDocument,
): PostsOutputModel => {
  const newPost: PostsOutputModel = new PostsOutputModel();
  newPost.id = post._id;
  newPost.title = post.title;
  newPost.shortDescription = post.shortDescription;
  newPost.content = post.content;
  newPost.blogId = post.blogId;
  newPost.blogName = post.blogName;
  newPost.createdAt = post.createdAt.toISOString();
  newPost.extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
    newestLikes: [],
  };
  return newPost;
};
*/
