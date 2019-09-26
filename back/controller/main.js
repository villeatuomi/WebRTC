const mR = require('express').Router()

mR.get('*', async (req, res) => {
  res.status(404).send()
})

module.exports = mR