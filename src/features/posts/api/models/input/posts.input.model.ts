import { Length } from 'class-validator';
import {
  BlogIsExist,
  BlogIsExistConstraint,
} from '../../../../../common/decorators/validate/blogId.decorator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class PostsInputModel {
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @Length(1, 1000)
  content: string;
  @BlogIsExist()
  blogId: string;
}

export class PostsInputModelForBlogs {
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @Length(1, 1000)
  content: string;
}

export class PostsQueryInputModel {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export class PostsQueryFixedModel {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}
