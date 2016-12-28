const net = require('net');
const readline = require('readline');

var storedSockets = []


var server = net.createServer(function connect(socket) {
  socket.on('error', (err) => {
    throw err;
  })

  socket.on('data', function(data) {
    var found = false;
    storedSockets.forEach((x) => {
      if(x.socket === socket && x.id !== undefined) {
          let message = `user ${x.id} says: ${data}`
          process.stdout.write(message); // maybe x.socket.write(message) to broadcast
           found = true;
      }
    })
    if(!found) {
      storeSocket(socket, data);
    }
  })

  socket.on('end', function() {
     storedSockets.forEach((x) => {
      if(x.socket === socket) {
        let message = `user ${x.id} disconnected\n`;
        process.stdout.write(message);
      }
    })
  })

  server.getConnections(function(err, count) {
  console.log('Connections: ' + count)
})


});

server.on('error', (err) => {
  throw err;
})

server.listen(6969, () => {
  console.log('opened server on', server.address())
})

function storeSocket(socket, id) {
  var socketId = {
    socket: socket,
    id: id
  }
  storedSockets.push(socketId);
}