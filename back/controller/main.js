const main = require('express').Router()
const path = require('path')

main.get('/ville', (req, res) => {
  res.sendFile(path.resolve('static/ville.html'))
})

main.get('*', async (req, res) => {
  res.status(404).send()
})


module.exports = main