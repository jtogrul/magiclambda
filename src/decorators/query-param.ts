import 'reflect-metadata'
import { registerParamDetails } from './params'

export const queryParamsMetadataKey = Symbol.for('queryParams')

/**
 * Type of the metadata object for Query Params.
 *
 * Map key: param name
 * Map value properties:
 * - `parameterIndex`: parameter's index in the handler function's argument list
 * - `required`: whether the parameter is required
 */
export type QueryParamsMetadata = {
  [key: string]: {
    parameterIndex: number,
    required: boolean
  }
}

export const registerQueryParams = (target: Object, propertyKey: string, parameterIndex: number, name: string, required: boolean) => {
  let queryParams: QueryParamsMetadata = Reflect.getOwnMetadata(queryParamsMetadataKey, target, propertyKey) || {}
  queryParams = {
    ...queryParams,
    [name]: { parameterIndex, required }
  }
  Reflect.defineMetadata(queryParamsMetadataKey, queryParams, target, propertyKey)
}

export function QueryParam (name: string, required: boolean) {
  return function (
    target: Object,
    propertyKey: string,
    parameterIndex: number
  ) {
    registerQueryParams(target, propertyKey, parameterIndex, name, required)
    registerParamDetails(target, propertyKey, parameterIndex, 'query', name)
  }
}
