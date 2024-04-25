import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepository } from '../../../features/auth/infrastructure/email.confirmation.repository';
import { EmailConfirmation } from '../../../features/auth/domain/email.confirmation.entity';

@ValidatorConstraint({ name: 'EmailConfirmation', async: false })
@Injectable()
export class EmailConfirmationConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async validate(value: any, args: ValidationArguments) {
    const isConfirmed: EmailConfirmation | null =
      await this.emailConfirmationRepository.findConfirmation(value);
    if (!isConfirmed || isConfirmed.expiredIn < new Date()) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Code is incorrect, expired or already been applied';
  }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function EmailConfirmationDecorator(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailConfirmationConstraint,
    });
  };
}
