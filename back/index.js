const app = require('./app')
const PORT = require('./config').port


const server = require('http').createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
});
const secureServer = require('https').createServer(app.credentials, app.app)
const ioS = require('socket.io')(secureServer);

require('./socket')(ioS)


server.listen(PORT.http, () => {
  console.log(`Web redirection server running on port: ${PORT.http}`)
})

secureServer.listen(PORT.https, () => {
  console.log(`Web server running on port: ${PORT.https}`)
})
