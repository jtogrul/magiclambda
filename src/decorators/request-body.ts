import 'reflect-metadata'
import { registerParamDetails } from './helpers'

export function requestBody (required: boolean) {
  return function (
    target: Object,
    propertyKey: string,
    parameterIndex: number
  ) {
    Reflect.defineMetadata('requestBodyParam', [parameterIndex, required], target, propertyKey)
    registerParamDetails(target, propertyKey, parameterIndex, 'body')
  }
}
