# MonoLambda

A simple framework for building AWS Lambda functions that can handle multiple AWS API Gateway requests.

## Installation

Install by `npm`

```sh
npm install --save monolambda
```

Modify your `tsconfig.json` to enable annotations

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Getting started

To have the MonoLambda handle API Gateway requests you will need to declare a Controller class with route handler methods.

```typescript
// controller.ts

import { Controller, Get, pathParam } from 'monolambda'

@Controller('/example')
export class ExampleController {
  @Get('/hello/{name}')
  getHelloName (@pathParam('name') name: string): Response {
    return ok(`Hello ${name}`)
  }
}
```

Then you can use `controllerHandler` from `monorepo` library to automaticly create API Gateway compatible request handler, which will be able to handle all the requests defined in your controller.

```typescript
// index.ts

import { controllerHandler } from 'monolambda'
import { ExampleController } from './controller'

export const handler = controllerHandler(ExampleController)
```

## Supported annotations

### `@Controller(basePath: string)` [class]

Marks the annotated class as a Controller and assigns a `basePath` to all routes that it has defined.

### `@Get(path: string)` [method]

Registers the annotated method as `GET` request handler for given `path`. Path params should be specified in `{paramName}` format.

### `@Post(path: string)` [method]

Registers the annotated method as `POST` request handler for given `path`. Path params should be specified in `{paramName}` format.

### `@Put(path: string)` [method]

Registers the annotated method as `PUT` request handler for given `path`. Path params should be specified in `{paramName}` format.

### `@Patch(path: string)` [method]

Registers the annotated method as `PATCH` request handler for given `path`. Path params should be specified in `{paramName}` format.

### `@Delete(path: string)` [method]

Registers the annotated method as `DELETE` request handler for given `path`. Path params should be specified in `{paramName}` format.

### `@pathParam(name: string)` [argument]

Marks the annotated argument as the receiver of the path param `name` which was specified in the `path` of the Router

### `@queryParam(name: string, required: boolean)` [argument]

Marks the annotated argument as the receiver of the query param `name`. Setting `required` to `true` instructs the handler to fail the request if the query parameter is not present.

### `@requestBody(required: boolean)` [argument]

Marks the annotated argument as the receiver of the HTTP request body. Setting `required` to `true` instructs the handler to fail the request if the request body is not present.

### `validated (schema: Joi.Schema)` [argument]

Instructs the handler to validate the annotated parameter (Path, Query or RequestBody) against given [Joi](https://github.com/sideway/joi) schema.


## Router response

MonoLambda provides utilities to make it easy to return a response body with common status codes. Simply `return` one of the following function results from your routers.

### `ok(body?: any)`

Builds response with status code `200` and response `body` if provided

### `badRequest(body?: any)`

Builds response with status code `400` and response `body` if provided

### `notFound(body?: any)`

Builds response with status code `404` and response `body` if provided

### `internalServerError(body?: any)`

Builds response with status code `500` and response `body` if provided

### `response(status: number, body?: any)`

Builds response with status code `status` and response `body` if provided