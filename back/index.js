const app = require('./app')
const PORT = require('./config').port


const server = require('http').createServer(app.app);
const secureServer = require('https').createServer(app.credentials, app.app)
const io = require('socket.io')(server);
const ioS = require('socket.io')(secureServer);

require('./socket')(io)
require('./socket')(ioS)


server.listen(PORT.http, () => {
  console.log(`Web server running on port: ${PORT.http}`)
})

secureServer.listen(PORT.https, () => {
  console.log(`Web server running on port: ${PORT.https}`)
})
