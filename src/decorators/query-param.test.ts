import { queryParam, QueryParamsMetadata, queryParamsMetadataKey } from './query-param'

describe('queryParam', () => {
  class TestController {
    testRoute (@queryParam('param1', true) first: string, @queryParam('param2', false) second: string) {}
  }

  it('should register path params', () => {
    const metadata: QueryParamsMetadata = Reflect.getOwnMetadata(queryParamsMetadataKey, TestController.prototype, 'testRoute')
    expect(metadata).toEqual({
      param1: { parameterIndex: 0, required: true },
      param2: { parameterIndex: 1, required: false }
    })
  })
})
