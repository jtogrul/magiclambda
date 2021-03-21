export const paramDetailsMetadataKey = Symbol.for('paramDetails')

export type ParamType = 'path' | 'query' | 'requestBody'

/**
 * Type of the metadata object for Path Params.
 *
 * Map key: parameter's index in the router function's argument list
 *
 * Map value properties:
 * - `paramType`: type of the parameter
 * - `paramName`: name of the parameter. Required for 'path' and 'query' parameter types
 */
export type ParamDetailsMetadata = {
  [key: number]: {
    paramType: ParamType,
    paramName?: string
  }
}

export const registerParamDetails = (target: Object, propertyKey: string, parameterIndex: number, type: ParamType, name?: string) => {
  let paramDetails: ParamDetailsMetadata = Reflect.getOwnMetadata(paramDetailsMetadataKey, target, propertyKey) || {}
  paramDetails = {
    ...paramDetails,
    [parameterIndex]: {
      paramType: type,
      paramName: name
    }
  }
  Reflect.defineMetadata(paramDetailsMetadataKey, paramDetails, target, propertyKey)
}
