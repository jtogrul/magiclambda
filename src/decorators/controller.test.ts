import { Controller } from './controller'

describe('controller', () => {
  @Controller('/test')
  class TestController {}

  it('should mark as controller', () => {
    expect(Reflect.getMetadata('isController', TestController.prototype)).toBe(true)
  })

  it('should register basePath', () => {
    expect(Reflect.getMetadata('basePath', TestController.prototype)).toBe('/test')
  })
})
