import 'reflect-metadata'
import { registerParamDetails, registerPathParams } from './helpers'

export function pathParam (name: string) {
  return function (
    target: Object, // Class
    propertyKey: string, // method name
    parameterIndex: number // method parameter index
  ) {
    registerPathParams(target, propertyKey, parameterIndex, name)
    registerParamDetails(target, propertyKey, parameterIndex, 'path', name)
  }
}
