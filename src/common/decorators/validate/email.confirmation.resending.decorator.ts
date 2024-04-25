import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../features/users/infrastructure/users.repository';

@ValidatorConstraint({ name: 'EmailConfirmationResending', async: false })
@Injectable()
export class EmailConfirmationResendingConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async validate(value: any, args: ValidationArguments) {
    const user = await this.usersRepository.getAllUserDataByLoginOrEmail(value);
    if (!user || user.isConfirmed) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email has already been confirmed or not exists';
  }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function EmailConfirmationResending(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailConfirmationResendingConstraint,
    });
  };
}
