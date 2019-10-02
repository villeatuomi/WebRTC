import Peer from 'peerjs';

//just testing, code not working yet
const peer = new Peer('i-Id', {host: 'localhost', port: 3001, path: '/peerjs'})

const conn = peer.connect('l-Id')
conn.on('open', id => {
  conn.send('hi!');

  console.log('My peer ID is: ' + id);
});
