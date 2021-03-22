import { Controller, Get, controllerHandler, pathParam, Response, ok, queryParam, Post, requestBody } from '.'
import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda'
import { Validated } from './decorators/validated'
import Joi from 'joi'

type HelloObject = {
  name: string
}

@Controller('/example')
export class ExampleController {
  @Get('/hello')
  getHello () {
    console.log('this endpoint does nothing, returns nothing')
  }

  @Get('/hello/{name}')
  getHelloName (@pathParam('name') name: string): Response {
    return ok(`Hello ${name}`)
  }

  @Get('/hello/{name1}/{name2}')
  getHelloName2 (@pathParam('name1') name1: string, @pathParam('name2') name2: string): Response {
    return ok(`Hello ${name1} and ${name2}`)
  }

  @Get('/hello/query')
  getHelloQuery (@queryParam('name1', true) name1: string, @queryParam('name2', false) name2: string) {
    if (!name2) {
      return ok(`Hello ${name1}`)
    } else {
      return ok(`Hello ${name1} and ${name2}`)
    }
  }

  @Post('/hello/body')
  postHello (@requestBody(true) name: string) {
    return ok(`Hello ${name}`)
  }

  @Post('/hello/body/object')
  postHelloObject (@requestBody(true) helloObject: HelloObject) {
    return ok(`Hello ${helloObject.name}`)
  }

  @Post('/hello/body/object/validated')
  postHelloObjectValidated (@Validated(Joi.object({ name: Joi.string().alphanum().min(3).max(30).required() })) @requestBody(true) helloObject: HelloObject) {
    return ok(`Hello ${helloObject.name}`)
  }
}

const handler = controllerHandler(ExampleController)

describe('controllerHandler', () => {
  test('Non-existing endpoint', () => {
    const event = {
      resource: '/some-random-path',
      httpMethod: 'GET'
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 404,
      body: '"Invalid base path"'
    })
  })

  // TODO object response body

  test('No params', () => {
    const event = {
      resource: '/example/hello',
      httpMethod: 'GET'
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200,
      body: '""'
    })
  })

  test('Single path param', () => {
    const event = {
      resource: '/example/hello/{name}',
      httpMethod: 'GET',
      pathParameters: {
        name: 'Foo'
      } as APIGatewayProxyEventPathParameters
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200,
      body: '"Hello Foo"'
    })
  })

  test('Multiple path params', () => {
    const event = {
      resource: '/example/hello/{name1}/{name2}',
      httpMethod: 'GET',
      pathParameters: {
        name1: 'Foo',
        name2: 'Bar'
      } as APIGatewayProxyEventPathParameters
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200,
      body: '"Hello Foo and Bar"'
    })
  })

  test('Multiple query params', () => {
    const event = {
      resource: '/example/hello/query',
      httpMethod: 'GET',
      queryStringParameters: {
        name1: 'Foo',
        name2: 'Bar'
      } as APIGatewayProxyEventPathParameters
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200,
      body: '"Hello Foo and Bar"'
    })
  })

  test('Missing non-required query parameter', () => {
    const event = {
      resource: '/example/hello/query',
      httpMethod: 'GET',
      queryStringParameters: {
        name1: 'Foo'
      } as APIGatewayProxyEventPathParameters
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200,
      body: '"Hello Foo"'
    })
  })

  test('Missing required query parameter', () => {
    const event = {
      resource: '/example/hello/query',
      httpMethod: 'GET',
      queryStringParameters: {
        someOtherParam: 'other'
      } as APIGatewayProxyEventPathParameters
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 400,
      body: JSON.stringify('Required query param "name1" is missing')
    })
  })

  test('Post simple request body', () => {
    const event = {
      resource: '/example/hello/body',
      httpMethod: 'POST',
      body: JSON.stringify('Foo')
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200,
      body: '"Hello Foo"'
    })
  })

  test('Post object request body', () => {
    const event = {
      resource: '/example/hello/body/object',
      httpMethod: 'POST',
      body: JSON.stringify({ name: 'Foo' } as HelloObject)
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200,
      body: '"Hello Foo"'
    })
  })

  test('Post invalid request body', () => {
    const event = {
      resource: '/example/hello/body/object',
      httpMethod: 'POST',
      body: JSON.stringify('test')
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toEqual({
      statusCode: 200, // TODO ?
      body: '"Hello undefined"'
    })
  })

  test('Post validated object request body should fail', () => {
    const event = {
      resource: '/example/hello/body/object/validated',
      httpMethod: 'POST',
      body: JSON.stringify({ name: 'X' } as HelloObject)
    } as APIGatewayProxyEvent

    const result = handler(event)

    const expectedResponse = {
      validationErrors: {
        body: {
          _original: { name: 'X' },
          details: [
            {
              message: '"name" length must be at least 3 characters long',
              path: ['name'],
              type: 'string.min',
              context: { limit: 3, value: 'X', label: 'name', key: 'name' }
            }
          ]
        }
      }
    }

    return expect(result).resolves.toStrictEqual({
      statusCode: 400,
      body: JSON.stringify(expectedResponse)
    })
  })

  test('Post validated object request body should pass', () => {
    const event = {
      resource: '/example/hello/body/object/validated',
      httpMethod: 'POST',
      body: JSON.stringify({ name: 'Myfriend' } as HelloObject)
    } as APIGatewayProxyEvent

    const result = handler(event)

    return expect(result).resolves.toStrictEqual({
      statusCode: 200,
      body: '"Hello Myfriend"'
    })
  })
})
