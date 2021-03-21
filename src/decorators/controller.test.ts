import { Controller, controllerMetadataKey } from './controller'

describe('controller', () => {
  @Controller('/test')
  class TestController {}

  it('should add controller metadata', () => {
    expect(Reflect.hasMetadata(controllerMetadataKey, TestController.prototype)).toBe(true)
  })

  it('should register basePath', () => {
    const metadata = Reflect.getMetadata(controllerMetadataKey, TestController.prototype)
    expect(metadata).toHaveProperty('basePath', '/test')
  })
})
