import Joi from 'joi'
import 'reflect-metadata'

export const validatedParamsMetadataKey = Symbol.for('validatedParams')

/**
 * Type of the metadata object for Validated Params.
 *
 * Map key: parameter's index in the router function's argument list
 * Map value: Joi schema
 */
export type ValidatedParamsMetadata = {
  [key: number]: Joi.Schema
}

export function Validated (schema: Joi.Schema) {
  return function (
    target: Object, // Class
    propertyKey: string, // method name
    parameterIndex: number // method parameter index
  ) {
    let validatedParams: ValidatedParamsMetadata = Reflect.getOwnMetadata(validatedParamsMetadataKey, target, propertyKey) || {}
    validatedParams = {
      ...validatedParams,
      [parameterIndex]: schema
    }
    Reflect.defineMetadata(validatedParamsMetadataKey, validatedParams, target, propertyKey)
  }
}
