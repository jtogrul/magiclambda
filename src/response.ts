import { APIGatewayProxyResult } from 'aws-lambda'

export type Response = {
  status: number
  body: any
}

export const response = (status: number, body: any = ''): Response => {
  return { status, body }
}

export const ok = (body?: any): Response => {
  return { status: 200, body: body || '' }
}

export const badRequest = (body: any): Response => {
  return { status: 400, body }
}

export const notFound = (body: any): Response => {
  return { status: 404, body }
}

export const internalServerError = (body: any): Response => {
  return { status: 500, body }
}

export const lambdaResult = (response: Response): APIGatewayProxyResult => {
  return {
    statusCode: response.status,
    body: JSON.stringify(response.body)
  }
}
