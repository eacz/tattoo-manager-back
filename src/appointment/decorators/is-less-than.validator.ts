import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsLessThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = Number(
            (args.object as any)[relatedPropertyName],
          );
          const targetValue = Number(value);

          if (isNaN(targetValue) || isNaN(relatedValue)) {
            return false;
          }
          return value < relatedValue; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
