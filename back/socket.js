const io = require('socket.io')();
const PORT = require('./config').port.wss


io.on('connection', client => {
  client.emit('greeting', {message: 'hello'})
  console.log(`\nclient just connected`)
  console.log(`\nclients connected: ${io.engine.clientsCount}`)

  client.on('*', data => {
    console.log(data);
  });

  client.on('disconnect', () => {
    console.log("\nclient has disconnected");
  });
});

console.log(`\nWebSocket is open on port: ${PORT}`)

module.exports = {
  io,
  PORT
}