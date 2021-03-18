import { queryParam } from './query-param'

describe('queryParam', () => {
  class TestController {
    testRoute (@queryParam('param1', true) first: string, @queryParam('param2', false) second: string) {}
  }

  it('should register path params', () => {
    const metadata = Reflect.getOwnMetadata('queryParams', TestController.prototype, 'testRoute')
    expect(metadata).toEqual({
      param1: [0, true],
      param2: [1, false]
    })
  })
})
