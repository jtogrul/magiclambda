import { requestBody } from './request-body'

describe('requestParam', () => {
    type HelloObject = {
      name: string
    }

    class TestController {
      testRoute1 (@requestBody(true) helloObject: HelloObject) {}
      testRoute2 (@requestBody(false) helloObject: HelloObject) {}
      testRoute3 (anotherParam: string, @requestBody(false) helloObject: HelloObject) {}
    }

    it('should register required body param', () => {
      const metadata = Reflect.getOwnMetadata('requestBodyParam', TestController.prototype, 'testRoute1')
      expect(metadata).toEqual([0, true])
    })

    it('should register optional body param', () => {
      const metadata = Reflect.getOwnMetadata('requestBodyParam', TestController.prototype, 'testRoute2')
      expect(metadata).toEqual([0, false])
    })

    it('should register body param\'s argument index', () => {
      const metadata = Reflect.getOwnMetadata('requestBodyParam', TestController.prototype, 'testRoute3')
      expect(metadata).toEqual([1, false])
    })
})
