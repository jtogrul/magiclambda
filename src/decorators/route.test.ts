import { Delete, Get, Patch, Post, Put } from './route'

describe('controller', () => {
  class TestController {
    @Get('/hello')
    getHello () {}

    @Post('/hello')
    postHello () {}

    @Delete('/hello')
    deleteHello () {}

    @Put('/hello')
    putHello () {}

    @Patch('/hello')
    patchHello () {}
  }

  it('should register routes', () => {
    const metadata = Reflect.getMetadata('handlers', TestController.prototype)
    expect(metadata).toEqual({
      '/hello#GET': 'getHello',
      '/hello#POST': 'postHello',
      '/hello#DELETE': 'deleteHello',
      '/hello#PUT': 'putHello',
      '/hello#PATCH': 'patchHello'
    })
  })
})
