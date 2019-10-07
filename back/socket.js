const io = require('socket.io')();
const PORT = require('./config').port.wss




// io methods are something server activates
// socket methods are something connected client activates

io.on('connection', (socket) => {
  console.log(`The user "${socket.id}" connected.`);


  // SEND TO ALL CONNECTED CLIENTS AN ARRAY OF CONNECTED CLIENTS WHEN NEW CLIENT CONNECTS
  io.clients((error, clients) => {

    if (error) return console.log(error)

    console.log(`List of clients connected:`);
    let i = 0
    clients.forEach(client => {
      console.log(`-${i}- ${client}`);
    })
    console.log(`Overall Clients connected: ${clients.length}`)

    io.emit('users', clients); // This send list of IDs to all the clients.
    socket.emit('clientsFirstTime', clients); // This send a list of IDs only to the newly connected client.
  });

  socket.on('sendOffer', (receiver, msg) => {
    // Relay a message from the sender to the receiver.
    socket.to(receiver).emit('messageFromUser', msg);
  });

  socket.on('disconnect', () => {
    console.log(`--- ${socket.id} disconnected ---`);

    io.clients((error, clients) => {
      if (error) throw error;
      console.log(clients);
      io.emit('users', clients); // tämä lähettää kaikille käyttäjille lista kytketyistä käyttäjistä.
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