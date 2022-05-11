#!/usr/bin/env node
const path = require('path')
const express = require('express')
const Mock = require('./Mock')
const { random } = require('./util')

const app = express()

const options = {
  port: 5050,
  time: '100-300',
  cors: false,
  directory: 'mock',
}

const directory = path.resolve(process.cwd(), options.directory)
const mock = new Mock(directory)

app.all('*', function (req, res) {
  if (options.cors) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Headers', 'content-type')
      res.header('Access-Control-Allow-Methods', 'PUT,DELETE,PATCH')
      res.end()
      return
    }
  }

  res.header('Cache-Control', 'no-store')

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

app.listen(options.port, () => {
  console.log(`mock server listening on port ${options.port}`)
})
