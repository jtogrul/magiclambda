import Joi from 'joi'
import { RequestBody } from './request-body'
import { Validated, validatedParamsMetadataKey } from './validated'

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
      testRoute1 (@Validated(schema) @RequestBody(true) helloObject: HelloObject) {}
    }

    it('should register validation schema', () => {
      const metadata = Reflect.getOwnMetadata(validatedParamsMetadataKey, TestController.prototype, 'testRoute1')
      expect(metadata).toStrictEqual({
        0: schema
      })
    })
})
