const main = require('express').Router()
const path = require('path')
const fs = require('fs')
const ioClient = require('socket.io-client/dist/socket.io.js')

const getFile = (res, filePath) => {
  const file = path.resolve(filePath)
  try {
    if (fs.existsSync(file)) {
      return res.sendFile(file)
    }
  } catch(err) {
    console.error(err)
    return res.status(404).send()
  }
}

main.get('/ville', (req, res) => {
  const file = path.resolve('static/ville.html')
  getFile(res, file)
})

main.get('/socket.io', (req, res) => {
  const file = path.resolve('node_modules/socket.io-client/dist/socket.io.js')
  getFile(res, file)
})

main.get('/matias', (req, res) => {
  const file = path.resolve('static/matias.html')
  getFile(res, file)
})

main.get('*', async (req, res) => {
  res.status(404).send()
})


module.exports = main