import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
let invalidHour = '';

@ValidatorConstraint({ async: true })
export class IsScheduleConstraint implements ValidatorConstraintInterface {
  async validate(value: string[], args: ValidationArguments) {
    let isValid = true;

    value.some((hour) => {
      if (!timeRegex.test(hour)) {
        isValid = false;
        invalidHour = hour;
      }
    });

    return isValid;
  }
  defaultMessage(args: ValidationArguments) {
    return `${invalidHour} is not a valid hour format, the format should be HH:mm`;
  }
}

export function IsSchedule(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsScheduleConstraint,
    });
  };
}
