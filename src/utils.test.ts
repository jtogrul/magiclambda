import { placeElementAt } from './utils'

describe('placeElementAt', () => {
  it('should create array if empty', () => {
    expect(placeElementAt([], 0, 'hello')).toEqual(['hello'])
    expect(placeElementAt([], 1, 'hello')).toEqual([undefined, 'hello'])
    expect(placeElementAt([], 2, 'hello')).toEqual([undefined, undefined, 'hello'])
  })

  it('should insert if index fits length', () => {
    expect(placeElementAt([undefined, undefined, undefined], 0, 'hello')).toEqual(['hello', undefined, undefined])
    expect(placeElementAt([undefined, undefined, undefined], 1, 'hello')).toEqual([undefined, 'hello', undefined])
    expect(placeElementAt([undefined, undefined, undefined], 2, 'hello')).toEqual([undefined, undefined, 'hello'])
  })

  it('should extend array if index does not fit length', () => {
    expect(placeElementAt([undefined], 1, 'hello')).toEqual([undefined, 'hello'])
    expect(placeElementAt([undefined, undefined], 2, 'hello')).toEqual([undefined, undefined, 'hello'])
  })
})
