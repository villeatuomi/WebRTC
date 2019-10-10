const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mainRouter = require('./controller/main')
const middleware = require('./utility/middleware')
const config = require('./config')


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

// Certificate

const privateKey = (config.development)?"":fs.readFileSync('/etc/letsencrypt/live/dev.lira.fi/privkey.pem', 'utf8');
const certificate = (config.development)?"":fs.readFileSync('/etc/letsencrypt/live/dev.lira.fi/cert.pem', 'utf8');
const ca = (config.development)?"":fs.readFileSync('/etc/letsencrypt/live/dev.lira.fi/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
}



app.use(middleware.requestLogger)
app.use(bodyParser.json())

app.use('/', express.static(__dirname+'/static'));

app.use('', mainRouter)

app.use(express.static('../front'))


module.exports = {
  app,
  credentials
}