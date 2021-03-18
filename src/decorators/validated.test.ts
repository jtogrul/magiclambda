import Joi from 'joi'
import { requestBody } from './request-body'
import { validated } from './validated'

describe('validated', () => {
    type HelloObject = {
      name: string
    }

    const schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
    })

    class TestController {
      testRoute1 (@validated(schema) @requestBody(true) helloObject: HelloObject) {}
    }

    it('should register validation schema', () => {
      const metadata = Reflect.getOwnMetadata('validatedParams', TestController.prototype, 'testRoute1')
      expect(metadata).toStrictEqual({
        0: schema
      })
    })
})