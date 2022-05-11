#!/usr/bin/env node
const express = require('express')
const { random } = require('./util')

const app = express()

const options = {
  port: 5050,
  time: '100-300',
}

app.all('*', function (req, res) {
  res.header('Cache-Control', 'no-store')

  const time = random(options.time)
  setTimeout(() => {
    res.json({ message: 'default response from mock server' })
  }, time)
})

app.listen(options.port, () => {
  console.log(`mock server listening on port ${options.port}`)
})
