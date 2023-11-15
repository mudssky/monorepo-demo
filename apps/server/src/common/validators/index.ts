import { ValidationOptions, registerDecorator } from 'class-validator'

export function IsPortNum(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPortNum',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          console.log({ value })

          return typeof value === 'number' && value >= 1224 && value <= 65535
        },
      },
    })
  }
}
