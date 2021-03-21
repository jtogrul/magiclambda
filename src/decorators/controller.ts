import 'reflect-metadata'

export const controllerMetadataKey = Symbol.for('controller')

/**
 * Type of the metadata object for Controllers
 */
export type ControllerMetadata = {
  basePath: string
}

export function Controller (basePath: string) {
  return (constructor: Function) => {
    const metadata: ControllerMetadata = { basePath }
    Reflect.defineMetadata(controllerMetadataKey, metadata, constructor.prototype)
  }
}
