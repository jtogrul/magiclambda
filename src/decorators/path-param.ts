import 'reflect-metadata'
import { registerParamDetails } from './params'

export const pathParamsMetadataKey = Symbol.for('pathParams')

/**
 * Type of the metadata object for Path Params.
 *
 * Map key: param name
 * Map value properties:
 * - `parameterIndex`: Parameter's index in the router function's argument list
 */
export type PathParamsMetadata = {
  [key: string]: {
    parameterIndex: number
  }
}

export const registerPathParams = (target: Object, propertyKey: string, parameterIndex: number, name: string) => {
  let pathParams: PathParamsMetadata = Reflect.getOwnMetadata(pathParamsMetadataKey, target, propertyKey) || {}
  pathParams = {
    ...pathParams,
    [name]: { parameterIndex }
  }
  Reflect.defineMetadata(pathParamsMetadataKey, pathParams, target, propertyKey)
}

export function PathParam (name: string) {
  return function (
    target: Object, // Class
    propertyKey: string, // method name
    parameterIndex: number // method parameter index
  ) {
    registerPathParams(target, propertyKey, parameterIndex, name)
    registerParamDetails(target, propertyKey, parameterIndex, 'path', name)
  }
}
