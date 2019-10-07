const fs = require('fs')

const trueLog = console.log

console.log = (msg) => {

  const date = new Date()
  const dateString = `\n[${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] `

  msg = dateString+msg

  fs.appendFile("./log.log", msg, err => {
    if(err) {
      return trueLog(err)
    }
  })

  trueLog(msg)

}

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mainRouter = require('./controller/main')
const apiRouter = require('./controller/api')
const middleware = require('./utility/middleware')

app.use(middleware.requestLogger)
app.use(bodyParser.json())

app.use('/', express.static('../front/test-socket.html'));

app.use('/api', apiRouter)
app.use('', mainRouter)

app.use(express.static('../front'))


module.exports = app