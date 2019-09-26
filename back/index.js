const app = require('./app')
const http = require('http');
const Server = http.createServer(app);

const PORT = 3001
Server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {
  Server
}