import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Joi from 'joi'
import { ControllerMetadata, controllerMetadataKey, HandlersMetadata, handlersMetadataKey, PathParamsMetadata, pathParamsMetadataKey, QueryParamsMetadata, queryParamsMetadataKey, RequestBodyParamMetadata, requestBodyParamMetadataKey } from './decorators'
import { ParamDetailsMetadata, paramDetailsMetadataKey } from './decorators/params'
import { ValidatedParamsMetadata, validatedParamsMetadataKey } from './decorators/validated'
import { lambdaResult, notFound, ok, response, badRequest, Response, internalServerError } from './response'
import { placeElementAt } from './utils'

export const controllerHandler = <Controller>(ControllerConstructor: new () => Controller): (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> => {
  return async (event) => {
    console.log('Received event', event)

    // Check if a correct controller is provided
    const controllerMetadata: ControllerMetadata = Reflect.getMetadata(controllerMetadataKey, ControllerConstructor.prototype)
    if (!controllerMetadata) {
      return lambdaResult(internalServerError('Invalid controller provided'))
    }

    // Check if a correct route exists
    const { basePath } = controllerMetadata
    if (!event.resource.startsWith(basePath)) {
      return lambdaResult(notFound('Invalid base path'))
    }

    const handlers: HandlersMetadata = Reflect.getMetadata(handlersMetadataKey, ControllerConstructor.prototype)
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
      const handlerPathParams: PathParamsMetadata = Reflect.getMetadata(pathParamsMetadataKey, ControllerConstructor.prototype, handler) || {}

      for (const [paramName, paramValue] of Object.entries(event.pathParameters)) {
        if (!(paramName in handlerPathParams)) {
          return lambdaResult(internalServerError(`URL param "${paramName}" is not declared as a route handler argument`))
        }
        handlerParams = placeElementAt(handlerParams, handlerPathParams[paramName].parameterIndex, paramValue)
      }
    }

    // Process query params
    const handlerQueryParams: QueryParamsMetadata = Reflect.getMetadata(queryParamsMetadataKey, ControllerConstructor.prototype, handler) || {}

    const eventQueryParams = {
      ...(event.queryStringParameters || {}),
      ...(event.multiValueQueryStringParameters || {}) // TODO add support for multi value query params?
    }
    for (const [paramName, paramConfig] of Object.entries(handlerQueryParams)) {
      const { parameterIndex, required } = paramConfig as any

      if (paramName in eventQueryParams) {
        handlerParams = placeElementAt(handlerParams, parameterIndex, eventQueryParams[paramName])
      } else {
        if (required) {
          return lambdaResult(response(400, `Required query param "${paramName}" is missing`))
        } else {
          handlerParams = placeElementAt(handlerParams, parameterIndex, null)
        }
      }
    }

    // Process Request body
    const requestBodyParamConfig: RequestBodyParamMetadata = Reflect.getMetadata(requestBodyParamMetadataKey, ControllerConstructor.prototype, handler)
    if (requestBodyParamConfig) {
      const { parameterIndex, required } = requestBodyParamConfig

      if (event.body) {
        const requestBody = JSON.parse(event.body)
        handlerParams = placeElementAt(handlerParams, parameterIndex, requestBody)
      } else {
        if (required) {
          return lambdaResult(response(400, 'Request body is missing'))
        } else {
          handlerParams = placeElementAt(handlerParams, parameterIndex, null)
        }
      }
    }

    // Validate params
    const paramValidationConfig: ValidatedParamsMetadata = Reflect.getMetadata(validatedParamsMetadataKey, ControllerConstructor.prototype, handler)
    if (paramValidationConfig) {
      const validationErrors: {[key: string]: any} = {}
      const paramDetails: ParamDetailsMetadata = Reflect.getOwnMetadata(paramDetailsMetadataKey, ControllerConstructor.prototype, handler)
      for (const [paramIndex, schema] of Object.entries(paramValidationConfig) as any) {
        if (Joi.isSchema(schema)) {
          const param = paramDetails[paramIndex]
          const validationResult = (schema as Joi.Schema).validate(handlerParams[paramIndex as any], { abortEarly: false })
          if (validationResult.error) {
            const key = param.paramType === 'requestBody' ? 'body' : `${param.paramType}:${param.paramName}`
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
const detectHandlerName = (handlers: HandlersMetadata, path: string, basePath: string, method: string): string | undefined => {
  const routePath = path.split(basePath)[1]

  if (routePath in handlers) {
    if (method in handlers[routePath]) {
      return handlers[routePath][method]
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
