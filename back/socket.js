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
    socket.to(id).emit('messageFromUser', msg);
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





module.exports = {
  io,
  PORT
}