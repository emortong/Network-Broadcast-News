const net = require('net');

var new_client = net.connect(6969, 'localhost', function connect() {
  console.log('enter your username')

  process.stdin.on('data', function(data) {
    new_client.write(data);
  })

});



