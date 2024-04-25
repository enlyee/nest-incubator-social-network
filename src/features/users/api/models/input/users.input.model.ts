import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class UserCreateModel {
  @IsString()
  @Trim()
  @Length(3, 10)
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  @Trim()
  @Length(6, 20)
  password: string;
}
