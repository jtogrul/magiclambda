import 'reflect-metadata'

export function Controller (basePath: string) {
  return (constructor: Function) => {
    Reflect.defineMetadata('isController', true, constructor.prototype)
    Reflect.defineMetadata('basePath', basePath, constructor.prototype)
  }
}
