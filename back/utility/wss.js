const app = require('../app')
const http = require('http');
const socketio = require('socket.io')

const Server = http.createServer(app);


module.exports = {
  Server
}

