const net = require('net');
const readline = require('readline');

var storedSockets = []

var server = net.createServer(function connect(socket) {
  socket.on('error', (err) => {
    throw err;
  })

  socket.on('data', function(data) {
    var found = false;
    data = data.toString().trim();

    storedSockets.forEach((x) => {
      if(x.socket === socket && x.id !== undefined) {
        if(data.toString().trim() === 'fuck') {
          x.socket.write(`you've been kicked out\n`)
          x.socket.end();
        }
        let message = `${x.id} says: ${data}\n`;

        storedSockets.forEach((i) => {
          if(i.socket !== socket) {
            i.socket.write(message);
          }
        })
        found = true;
      }
    })
    if(!found) {
      storeSocket(socket, data);
      storedSockets.forEach((i) => {
        if(i.socket !== socket) {
          let message = `${data} joined the chat\n`
          i.socket.write(message);
        } else {
          socket.write(`you've joined the chat\n`)
        }
      })
    }
  })

  socket.on('end', function() {
    for(var i = 0; i < storedSockets.length; i++) {
      if(storedSockets[i].socket === socket) {
        let message = `user ${storedSockets[i].id} disconnected\n`;
        storedSockets.forEach((j) => {
          if(j.socket !== socket) {
            j.socket.write(message);
          }
        })
        storedSockets.splice(i,1);
      }
    }
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