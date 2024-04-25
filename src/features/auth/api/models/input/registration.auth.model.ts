import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';
import { LoginIsExist } from '../../../../../common/decorators/validate/login.registration.decorator';
import { EmailIsExist } from '../../../../../common/decorators/validate/email.registration.decorator';

export class RegistrationAuthModel {
  @IsString()
  @Trim()
  @Length(3, 10)
  @LoginIsExist()
  login: string;

  @IsEmail()
  @EmailIsExist()
  email: string;

  @IsString()
  @Trim()
  @Length(6, 20)
  password: string;
}
