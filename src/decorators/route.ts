import 'reflect-metadata'

export const handlersMetadataKey = Symbol.for('handlers')

/**
 * Type of the metadata object for Controller Handlers.
 *
 * Map key: route path
 * Map value value: map of [httpMethod, handlerFunctionName]
 */
export type HandlersMetadata = {
  [key: string]: {
    [key: string]: string
  }
}

export function route (path: string, method = 'ANY') {
  return function (
    target: Object, // controller class
    propertyKey: string, // function name
    descriptor: PropertyDescriptor
  ) {
    let handlersMap: HandlersMetadata = Reflect.getMetadata(handlersMetadataKey, target) || {}
    if (path in handlersMap) {
      handlersMap[path] = {
        ...handlersMap[path],
        [method]: propertyKey
      }
    } else {
      handlersMap = {
        ...handlersMap,
        [path]: {
          [method]: propertyKey
        }
      }
    }

    Reflect.defineMetadata(handlersMetadataKey, handlersMap, target)
  }
}

export function Get (path: string) {
  return route(path, 'GET')
}

export function Post (path: string) {
  return route(path, 'POST')
}

export function Put (path: string) {
  return route(path, 'PUT')
}

export function Patch (path: string) {
  return route(path, 'PATCH')
}

export function Delete (path: string) {
  return route(path, 'DELETE')
}
