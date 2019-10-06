const main = require('express').Router()

main.get('*', async (req, res) => {
  res.status(404).send()
})


module.exports = main