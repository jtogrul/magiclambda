import Joi from 'joi'
import 'reflect-metadata'

export function validated (schema: Joi.Schema) {
  return function (
    target: Object, // Class
    propertyKey: string, // method name
    parameterIndex: number // method parameter index
  ) {
    let validatedParams = Reflect.getOwnMetadata('validatedParams', target, propertyKey) || {}
    validatedParams = {
      ...validatedParams,
      [parameterIndex]: schema
    }
    Reflect.defineMetadata('validatedParams', validatedParams, target, propertyKey)
  }
}
