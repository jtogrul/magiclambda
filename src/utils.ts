export const placeElementAt = (params: any[], atIndex: number, value: any): any[] => {
  if (params.length < atIndex + 1) {
    params.push(...new Array(atIndex + 1 - params.length))
  }
  params[atIndex] = value
  return params
}
