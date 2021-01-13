const { invoke } = require('../../test-helpers')
const middy = require('../../core')
const inputOutputLogger = require('../');
const { async } = require('regenerator-runtime');

describe('📦 Middleware Input Output Logger', () => {
  test('It should log event and response', async () => {
    const logger = jest.fn()

    const handler = middy((event, context, cb) => {
      cb(null, { message: 'hello world' })
    })

    handler
      .use(inputOutputLogger({ logger }))

    await invoke(handler, { foo: 'bar', fuu: 'baz' })

    expect(logger).toHaveBeenCalledWith({ event: { foo: 'bar', fuu: 'baz' } })
    expect(logger).toHaveBeenCalledWith({ response: { message: 'hello world' } })
  })
  describe('omitPaths', () => {
    test('It should omit paths', async () => {
      const logger = jest.fn()

      const handler = middy((event, context, cb) => {
        cb(null, { message: 'hello world', bar: 'bi' })
      })

      handler
        .use(inputOutputLogger({ logger, omitPaths: ['event.foo', 'response.bar'] }))

      await invoke(handler, { foo: 'bar', fuu: 'baz' })

      expect(logger).toHaveBeenCalledWith({ event: { fuu: 'baz' } })
      expect(logger).toHaveBeenCalledWith({ response: { message: 'hello world' } })
    })
    test('It should include identifier if supplied', async () => {
      const logger = jest.fn()

      const handler = middy((event, context, cb) => {
        cb(null, { message: 'hello world', bar: 'bi' })
      })

      handler
        .use(inputOutputLogger({ logger, omitPaths: ['event.foo', 'response.bar'], identifier: '123' }))

      await invoke(handler, { foo: 'bar', fuu: 'baz' })

      expect(logger).toHaveBeenCalledWith({ identifier: '123', event: { fuu: 'baz' } })
      expect(logger).toHaveBeenCalledWith({ identifier: '123', response: { message: 'hello world' } })
    })
    test('It should skip paths that do not exist', async () => {
      const logger = jest.fn()

      const handler = middy((event, context, cb) => {
        cb(null, 'yo')
      })

      handler
        .use(inputOutputLogger({ logger, omitPaths: ['event.zooloo', 'event.foo.hoo', 'response.bar'] }))

      await invoke(handler, { foo: 'bar', fuu: 'baz' })

      expect(logger).toHaveBeenCalledWith({ event: { foo: 'bar', fuu: 'baz' } })
      expect(logger).toHaveBeenCalledWith({ response: 'yo' })
    })
    test('Skipped parts should be present in the response', async () => {
      const logger = jest.fn()

      const handler = middy((event, context, cb) => {
        cb(null, { foo: [{ foo: 'bar', fuu: 'baz' }] })
      })

      handler
        .use(inputOutputLogger({ logger, omitPaths: ['event.zooloo', 'event.foo.hoo', 'response.foo[0].foo'] }))

      const response = await invoke(handler, { foo: 'bar', fuu: 'baz' })

      expect(logger).toHaveBeenCalledWith({ event: { foo: 'bar', fuu: 'baz' } })
      expect(logger).toHaveBeenCalledWith({ response: { foo: [{ fuu: 'baz' }] } })

      expect(response).toMatchObject({ foo: [{ foo: 'bar', fuu: 'baz' }] })
    })
  })
})
