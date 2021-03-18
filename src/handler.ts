import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Joi from 'joi'
import { lambdaResult, notFound, ok, response, badRequest, Response, internalServerError } from './response'
import { placeElementAt } from './utils'

export const controllerHandler = <Controller>(ControllerConstructor: new () => Controller): (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> => {
  return async (event) => {
    console.log('Received event', event)

    // Check if a correct controller is provided
    const isController = Reflect.hasMetadata('isController', ControllerConstructor.prototype)
    if (!isController) {
      return lambdaResult(internalServerError('Internal Server Error. Bad controller'))
    }

    // Check if a correct route exists
    const basePath = Reflect.getMetadata('basePath', ControllerConstructor.prototype)
    if (!event.resource.startsWith(basePath)) {
      return lambdaResult(notFound('Invalid base path'))
    }

    const handlers = Reflect.getMetadata('handlers', ControllerConstructor.prototype)
    const handler = detectHandlerName(handlers, event.resource, basePath, event.httpMethod)
    if (!handler) {
      return lambdaResult(notFound('Route not found'))
    }

    // controller instance
    const controllerInstance = new ControllerConstructor()

    // handler function
    const handlerFunction: Function = Reflect.get(ControllerConstructor.prototype, handler)

    // Initial handler function parameters
    let handlerParams: any[] = []

    // Process path params
    if (event.pathParameters) {
      const handlerPathParams = Reflect.getMetadata('pathParams', ControllerConstructor.prototype, handler) || {}

      for (const [paramName, paramValue] of Object.entries(event.pathParameters)) {
        if (!(paramName in handlerPathParams)) {
          return lambdaResult(internalServerError(`URL param "${paramName}" is not declared as a route handler argument`))
        }
        handlerParams = placeElementAt(handlerParams, handlerPathParams[paramName], paramValue)
      }
    }

    // Process query params
    const handlerQueryParams = Reflect.getMetadata('queryParams', ControllerConstructor.prototype, handler) || {}

    const eventQueryParams = {
      ...(event.queryStringParameters || {}),
      ...(event.multiValueQueryStringParameters || {}) // TODO add support for multi value query params?
    }
    for (const [paramName, paramConfig] of Object.entries(handlerQueryParams)) {
      const [index, required] = paramConfig as any

      if (paramName in eventQueryParams) {
        handlerParams = placeElementAt(handlerParams, index, eventQueryParams[paramName])
      } else {
        if (required) {
          return lambdaResult(response(400, `Required query param "${paramName}" is missing`))
        } else {
          handlerParams = placeElementAt(handlerParams, index, null)
        }
      }
    }

    // Process Request body
    const requestBodyParamConfig = Reflect.getMetadata('requestBodyParam', ControllerConstructor.prototype, handler)
    if (requestBodyParamConfig) {
      const [index, required] = requestBodyParamConfig as any

      if (event.body) {
        const requestBody = JSON.parse(event.body)
        handlerParams = placeElementAt(handlerParams, index, requestBody)
      } else {
        if (required) {
          return lambdaResult(response(400, 'Request body is missing'))
        } else {
          handlerParams = placeElementAt(handlerParams, index, null)
        }
      }
    }

    // Validate params
    const paramValidationConfig = Reflect.getMetadata('validatedParams', ControllerConstructor.prototype, handler)
    if (paramValidationConfig) {
      const validationErrors: {[key: string]: any} = {}
      const paramDetails = Reflect.getOwnMetadata('paramDetails', ControllerConstructor.prototype, handler)
      for (const [paramIndex, schema] of Object.entries(paramValidationConfig)) {
        if (Joi.isSchema(schema)) {
          const param = paramDetails[paramIndex]
          const validationResult = (schema as Joi.Schema).validate(handlerParams[paramIndex as any], { abortEarly: false })
          if (validationResult.error) {
            const key = param[0] === 'body' ? 'body' : `${param[0]}:${param[1]}`
            validationErrors[key] = validationResult.error
          }
        } else {
          console.log('Invalid schema')
        }
      }
      if (Object.keys(validationErrors).length > 0) {
        return lambdaResult(badRequest({ validationErrors }))
      }
    }

    // Execute route function
    const routeResponse = execute(controllerInstance, handlerFunction, handlerParams)
    return lambdaResult(routeResponse)
  }
}

// TODO handle asyncroniously?
const execute = <Controller>(controllerInstance: Controller, handlerFunc: Function, handlerArgs: any[]): Response => {
  console.log(`calling ${handlerFunc.name} with params`, handlerArgs)
  try {
    // TODO async handler support?
    const handlerResponse: Response = handlerFunc.apply(controllerInstance, handlerArgs) || ok()
    console.log('handlerResponse', handlerResponse)
    return handlerResponse
  } catch (e) {
    // TODO log error
    return internalServerError('Failed to process request')
  }
}

// TODO handlers type
const detectHandlerName = (handlers: {[key:string]:string}, path: string, basePath: string, method: string): string | undefined => {
  const routePath = path.split(basePath)[1]
  const strictRoutePath = `${routePath}#${method.toUpperCase()}`
  const fallbackRoutePath = `${routePath}#ANY`
  if (strictRoutePath in handlers) {
    return handlers[strictRoutePath]
  } else if (fallbackRoutePath in handlers) {
    return handlers[fallbackRoutePath]
  } else {
    return undefined
  }
}
