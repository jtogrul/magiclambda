export const registerParamDetails = (target: Object, propertyKey: string, parameterIndex: number, type: string, name?: string) => {
  let paramDetails = Reflect.getOwnMetadata('paramDetails', target, propertyKey) || {}
  paramDetails = {
    ...paramDetails,
    [parameterIndex]: [type, name]
  }
  Reflect.defineMetadata('paramDetails', paramDetails, target, propertyKey)
}

export const registerPathParams = (target: Object, propertyKey: string, parameterIndex: number, name: string) => {
  let pathParams = Reflect.getOwnMetadata('pathParams', target, propertyKey) || {}
  pathParams = {
    ...pathParams,
    [name]: parameterIndex
  }
  Reflect.defineMetadata('pathParams', pathParams, target, propertyKey)
}

export const registerQueryParams = (target: Object, propertyKey: string, parameterIndex: number, name: string, required: boolean) => {
  let queryParams = Reflect.getOwnMetadata('queryParams', target, propertyKey) || {}
  queryParams = {
    ...queryParams,
    [name]: [parameterIndex, required]
  }
  Reflect.defineMetadata('queryParams', queryParams, target, propertyKey)
}
