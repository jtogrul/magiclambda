import 'reflect-metadata'
import { registerQueryParams, registerParamDetails } from './helpers'

export function queryParam (name: string, required: boolean) {
  return function (
    target: Object,
    propertyKey: string,
    parameterIndex: number
  ) {
    registerQueryParams(target, propertyKey, parameterIndex, name, required)
    registerParamDetails(target, propertyKey, parameterIndex, 'query', name)
  }
}
