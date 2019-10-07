const app = require('./app')
const server = require('http').createServer(app);

const PORT = require('./config').port.http

server.listen(PORT, () => {
  console.log(`Web server running on port: ${PORT}`)
})