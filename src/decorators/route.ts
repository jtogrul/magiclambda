import 'reflect-metadata'

export function route (path: string, method = 'ANY') {
  return function (
    target: Object, // controller class
    propertyKey: string, // function name
    descriptor: PropertyDescriptor
  ) {
    let handlersMap = Reflect.getMetadata('handlers', target) || {}
    handlersMap = {
      ...handlersMap,
      [`${path}#${method}`]: propertyKey
    }
    Reflect.defineMetadata('handlers', handlersMap, target)
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
