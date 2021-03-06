'use strict'

process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
process.env.AWS_REGION = 'ca-central-1'

const endpoints = {
  '/': require('./examples/baseline'),
  '/api-gateway': require('./examples/api-gateway'),
  // '/dynamodb-event': require('./examples/dynamodb-event'),
  // '/kinesis-firehose-event': require('./examples/kinesis-firehose-event'),
  // '/kinesis-stream-event': require('./examples/kinesis-stream-event'),
  '/logging': require('./examples/logging'),
  '/s3-event': require('./examples/s3-event'),
  // '/s3-get-promise': require('./examples/s3-get-promise'),
  // '/s3-get-stream': require('./examples/s3-get-stream'),
  '/secrets': require('./examples/secrets'),
  // '/sns-event': require('./examples/sns-event'),
  '/sqs-event': require('./examples/sqs-event')
}

require('http')
  .createServer(async (req, res) => {
    await endpoints[req.url].handler(
      endpoints[req.url].event,
      endpoints[req.url].context
    )
    res.end()
  })
  .listen(3000)
