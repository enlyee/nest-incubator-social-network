import { Trim } from '../../../../../common/decorators/transform/trim.decorator';
import { IsString, IsUrl, Length } from 'class-validator';

export class BlogsInputModel {
  @IsString()
  @Trim()
  @Length(1, 15)
  name: string;

  @IsString()
  @Trim()
  @Length(1, 500)
  description: string;

  @IsString()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
