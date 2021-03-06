import { RequestBody, RequestBodyParamMetadata, requestBodyParamMetadataKey } from './request-body'

describe('requestBody', () => {
    type HelloObject = {
      name: string
    }

    class TestController {
      testRoute1 (@RequestBody(true) helloObject: HelloObject) {}
      testRoute2 (@RequestBody(false) helloObject: HelloObject) {}
      testRoute3 (anotherParam: string, @RequestBody(false) helloObject: HelloObject) {}
    }

    it('should register required body param', () => {
      const metadata: RequestBodyParamMetadata = Reflect.getOwnMetadata(requestBodyParamMetadataKey, TestController.prototype, 'testRoute1')
      expect(metadata).toEqual({ parameterIndex: 0, required: true })
    })

    it('should register optional body param', () => {
      const metadata: RequestBodyParamMetadata = Reflect.getOwnMetadata(requestBodyParamMetadataKey, TestController.prototype, 'testRoute2')
      expect(metadata).toEqual({ parameterIndex: 0, required: false })
    })

    it('should register body param\'s argument index', () => {
      const metadata: RequestBodyParamMetadata = Reflect.getOwnMetadata(requestBodyParamMetadataKey, TestController.prototype, 'testRoute3')
      expect(metadata).toEqual({ parameterIndex: 1, required: false })
    })
})
