const net = require('net');
const readline = require('readline');

// var id = 0;
var storedSockets = []


var server = net.createServer(function connect(socket) {
  socket.on('error', (err) => {
    throw err;
  })

  socket.on('data', function(data) {
    if(storedSockets.length === 0) {
      storeSocket(socket, data);
    }
    storedSockets.forEach((x) => {
      if(x.socket !== socket) {
        storeSocket(socket, data);
      } else if(x.socket === socket && x.id !== undefined) {
          let message = `user ${x.id} says: ${data}`
          process.stdout.write(message);
        }
    })
  })

  socket.on('end', function() {
     storedSockets.forEach((x) => {
      if(x.socket === socket) {
        let message = `user ${x.id} disconnected`;
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
  // id++;
}