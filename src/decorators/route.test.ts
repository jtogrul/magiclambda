import { Delete, Get, HandlersMetadata, handlersMetadataKey, Patch, Post, Put } from './route'

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

    @Get('/hey')
    getHey () {}
  }

  it('should register routes', () => {
    const metadata: HandlersMetadata = Reflect.getMetadata(handlersMetadataKey, TestController.prototype)
    expect(metadata).toEqual({
      '/hello': {
        GET: 'getHello',
        POST: 'postHello',
        DELETE: 'deleteHello',
        PUT: 'putHello',
        PATCH: 'patchHello'
      },
      '/hey': {
        GET: 'getHey'
      }
    })
  })
})
