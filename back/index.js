const app = require('./app')
const server = require('http').createServer(app);

const PORT = require('./config').port.http

server.listen(PORT, () => {
  console.log(`\nWeb server running on port: ${PORT}`)
})