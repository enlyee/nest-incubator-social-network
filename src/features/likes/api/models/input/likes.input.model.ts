import { IsLikeStatus } from '../../../../../common/decorators/validate/like.status.decorator';

export class LikesInputModel {
  @IsLikeStatus()
  likeStatus: 'Like' | 'Dislike' | 'None';
}
