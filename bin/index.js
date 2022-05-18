#!/usr/bin/env node
const path = require('path')
const express = require('express')
const args = require('args')
const Mock = require('./Mock')
const { random } = require('./util')

const app = express()

args
  .option('directory', 'The mock files directory', 'mock')
  .option('port', 'The mock server port', 5050)
  .option('time', 'The random request time range in ms', '100-300')
  .option('cors', 'Allow cors')
  .option('ignored', 'The files need ignore', '')

const packageJson = require(path.resolve(process.cwd(), 'package.json'))

const options = {
  ...args.parse(process.argv),
  ...(packageJson['mock-server'] || {}),
}

const directory = path.resolve(process.cwd(), options.directory)
const mock = new Mock(directory, options.ignored)

app.all('*', function (req, res) {
  res.header('Cache-Control', 'no-store')

  if (options.cors) {
    res.header({
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'content-type,authorization',
      'Access-Control-Allow-Methods': 'PUT,DELETE,PATCH',
    })
  }

  if (options.responseHeader) {
    res.header(options.responseHeader)
  }

  if (req.method === 'OPTIONS') {
    res.end()
    return
  }

  const time = random(options.time)
  setTimeout(() => {
    const key = `${req.method} ${req.path}`
    const api = mock.find(key)
    if (api) {
      api(req, res)
    } else {
      res.json({ message: 'default response from mock server' })
    }
  }, time)
})

const server = app.listen(options.port, () => {
  console.log(`mock server listening on port ${options.port}`)
})

process.on('SIGTERM', () => {
  mock.close()
  server.close()
})
