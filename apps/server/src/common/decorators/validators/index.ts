import { isIP, registerDecorator, ValidationOptions } from 'class-validator'

export function IsPortNum(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPortNum',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value >= 1224 && value <= 65535
        },
      },
    })
  }
}

// type IpCheckOption={
//   version?: IsIpVersion
// }
/**
 * 判断HOST是否合法，支持docker地址和localhost
 */
export function IsValidHost(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidHost',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (isIP(value)) {
            return true
          }
          if (['host.docker.internal', 'localhost'].includes(value)) {
            return true
          }

          return false
        },
      },
    })
  }
}
