const app = require('./app')
const server = require('http').createServer(app);
const ExpressPeerServer = require('peer').ExpressPeerServer;

const options = {
  debug: false
}

if(options.debug) console.log("\n+++ PEER server running in debug mode +++");
const peerServer = ExpressPeerServer(server, options);

peerServer.on('connection', async id => {
  console.log(id);
});

peerServer.on('disconnect', async id => {
  console.log(id, "session ended")
});

app.use('/peerjs', peerServer);

const PORT = 3001

server.listen(PORT, () => {
  console.log(`\nWeb server running on port ${PORT}`)
})