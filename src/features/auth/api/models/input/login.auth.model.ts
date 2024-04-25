import { IsString } from 'class-validator';

export class LoginAuthModel {
  @IsString()
  loginOrEmail: string;
  @IsString()
  password: string;
}
