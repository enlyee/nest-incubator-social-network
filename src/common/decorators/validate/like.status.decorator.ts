import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsLikeStatus', async: false })
@Injectable()
export class IsLikeStatusConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    return ['Like', 'Dislike', 'None'].includes(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'It is not like status';
  }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function IsLikeStatus(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsLikeStatusConstraint,
    });
  };
}
