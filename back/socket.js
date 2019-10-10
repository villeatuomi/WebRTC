// io methods are something server activates
// socket methods are something connected client activates

module.exports = (io) => {
  io.on('connection', (socket) => {

    const showConnectedClients = (clients) => {
      let i = 1
      let text = `List of clients connected:\n`
      clients.forEach(client => {
        text += `-${i}- ${client}\n`;
        i++
      })
      console.log(text);
      console.log(`Overall Clients connected: ${clients.length}`)
    }
    console.log(`+++ ${socket.id} connected +++`);

    // SEND TO ALL CONNECTED CLIENTS AN ARRAY OF CONNECTED CLIENTS WHEN NEW CLIENT CONNECTS
    io.clients((error, clients) => {
      if (error) return console.log(error)
      showConnectedClients(clients);
      io.emit('users', clients); // This send list of IDs to all the clients.
      //socket.emit('clientsFirstTime', clients); // This send a list of IDs only to the newly connected client.
      socket.emit('offerForClients', clients);
    });
    /*
        socket.on('sendOffer', (receiver, msg) => {
          // Relay a message from the sender to the receiver.
          socket.to(receiver).emit('offerFromUser', msg);
        });*/


    socket.on('sendAnswer', (receiver, msg) => {
      // Relay a message from the sender to the receiver.
      socket.to(receiver).emit('answerFromUser', msg);
    });


    socket.on('disconnect', () => {
      console.log(`--- ${socket.id} disconnected ---`);

      io.clients((error, clients) => {
        if (error) console.log(error);
        showConnectedClients(clients)
        io.emit('users', clients); // tämä lähettää kaikille käyttäjille lista kytketyistä käyttäjistä.
      });

    });

    socket.on('chat message', (msg) => {
      console.log(`The user "${socket.id}" sent message: ${msg}`);
      io.emit('chat message', msg);
    });


    socket.on('sendOffer', (receiver, msg) => {
      // Relay a message from the sender to the receiver.
      socket.to(receiver).emit('offerFromUser', msg);
    });

    socket.on("candidate", msg => {
      console.log("candidate message recieved!");
      socket.broadcast.emit("candidate", msg);
    });

    socket.on("sdp", msg => {
      console.log("sdp message broadcasted!");
      socket.broadcast.emit("sdp", msg);
    });

    socket.on("desc", desc => {
      console.log("description received!");
      socket.broadcast.emit("desc", desc);
    });

    socket.on("answer", answer => {
      console.log("answer broadcasted");
      socket.broadcast.emit("answer", answer);
    });

    socket.on("candiToRemote", (receiver, msg) => {
      console.log("candidate message recieved!");
      socket.to(receiver).emit("candiToRemote", msg);
    });

    socket.on("candiToLocal", (receiver, msg) => {
      console.log("candidate message recieved!");
      socket.to(receiver).emit("candiToLocal", msg);
    });

    socket.on("sdpToRemote", (receiver, msg) => {
      console.log("sdp message broadcasted!");
      socket.to(receiver).emit("sdpToRemote", msg);
    });

    socket.on("answerToLocal", (receiver, msg) => {
      console.log("answer message from remote recieved!");
      socket.to(receiver).emit("answerToLocal", msg);
    });

  });
};
