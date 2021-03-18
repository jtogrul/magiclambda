import { pathParam } from './path-param'

describe('pathParam', () => {
  class TestController {
    testRoute (@pathParam('param1') first: string, @pathParam('param2') second: string) {}
  }

  it('should register path params', () => {
    const metadata = Reflect.getOwnMetadata('pathParams', TestController.prototype, 'testRoute')
    expect(metadata).toEqual({
      param1: 0,
      param2: 1
    })
  })
})
