const io = require('socket.io')();
const PORT = require('./config').port.wss




// io methods are something server activates
// socket methods are something connected client activates

io.on('connection', (socket) => {
  console.log(`The user "${socket.id}" connected.`);

  // SEND TO ALL CONNECTED CLIENTS AN ARRAY OF CONNECTED CLIENTS WHEN NEW CLIENT CONNECTS
  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients);
    io.emit('users', clients); // This send list of IDs to all the clients.
    //io.to(socket.id).emit('clientsFirstTime', clients); // This send a list of IDs onlyt to the newly connected client.
    socket.emit('clientsFirstTime', clients); // This send a list of IDs onlyt to the newly connected client.
  });


  socket.on('sendOffer', (id, msg) => {
    // Relay a message from the sender to the receiver.
    socket.to(id).emit('messageFromUser', `Käyttäjä ${socket.id} lähetti sinulle yksityisviestin ${msg}`);
  });


  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected.`);

    io.clients((error, clients) => {
      if (error) throw error;
      console.log(clients);
      io.emit('users', clients); // tämän pitäisi lähettää kaikille käyttäjille lista kytketyistä käyttäjistä.
    });

  });

  socket.on('chat message', (msg) => {
    console.log(`The user "${socket.id}" sent message: ${msg}`);
    io.emit('chat message', msg);
  });


});






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