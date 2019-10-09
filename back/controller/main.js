const main = require('express').Router()
const path = require('path')
const fs = require('fs')

const getFile = (res, filePath) => {
  const file = path.resolve(filePath)

  if (fs.existsSync(file))
    return res.sendFile(file)
  else
    return res.status(404).send()
}

main.get('/ville/:number', (req, res) => {
  const file = path.resolve(`static/ville${req.params.number}.html`)
  getFile(res, file)
})

main.get('/ville/:file', (req, res) => {
  const file = path.resolve(`static/${req.params.file}`)
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




main.get('/.well-known/acme-challenge/randomtesxthere', (req, res) => {
  const file = path.resolve('certificate/randomtesxthere')
  getFile(res, file)
})

main.get('*', async (req, res) => {
  res.status(404).send()
})


module.exports = main