import { PathParam, PathParamsMetadata, pathParamsMetadataKey } from './path-param'

describe('pathParam', () => {
  class TestController {
    testRoute (@PathParam('param1') first: string, @PathParam('param2') second: string) {}
  }

  it('should register path params', () => {
    const metadata: PathParamsMetadata = Reflect.getOwnMetadata(pathParamsMetadataKey, TestController.prototype, 'testRoute')
    expect(metadata).toEqual({
      param1: { parameterIndex: 0 },
      param2: { parameterIndex: 1 }
    })
  })
})
