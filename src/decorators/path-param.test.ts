import { pathParam, PathParamsMetadata, pathParamsMetadataKey } from './path-param'

describe('pathParam', () => {
  class TestController {
    testRoute (@pathParam('param1') first: string, @pathParam('param2') second: string) {}
  }

  it('should register path params', () => {
    const metadata: PathParamsMetadata = Reflect.getOwnMetadata(pathParamsMetadataKey, TestController.prototype, 'testRoute')
    expect(metadata).toEqual({
      param1: { parameterIndex: 0 },
      param2: { parameterIndex: 1 }
    })
  })
})
