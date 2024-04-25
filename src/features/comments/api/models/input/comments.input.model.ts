import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class CommentsInputModel {
  @IsString()
  @Trim()
  @Length(20, 300)
  content: string;
}
