import 'reflect-metadata'
import { registerParamDetails } from './params'

export const requestBodyParamMetadataKey = Symbol.for('requestBodyParam')

/**
 * Type of the metadata object for Query Params.
 */
export type RequestBodyParamMetadata = {
  parameterIndex: number,
  required: boolean
}

export function requestBody (required: boolean) {
  return function (
    target: Object,
    propertyKey: string,
    parameterIndex: number
  ) {
    const metadata: RequestBodyParamMetadata = { parameterIndex, required }
    Reflect.defineMetadata(requestBodyParamMetadataKey, metadata, target, propertyKey)
    registerParamDetails(target, propertyKey, parameterIndex, 'requestBody')
  }
}
