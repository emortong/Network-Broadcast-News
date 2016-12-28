const net = require('net');


var server = net.createServer(function connect(socket) {
  socket.on('error', (err) => {
    throw err;
  })

  socket.on('connect', function() {
    console.log('connected');
  })

  socket.on('data', function(data) {
    console.log('you sent data!')
  })

  socket.on('end', function() {
    console.log('socket disconnected')
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