const net = require('net');

var new_client = net.connect(6969, 'localhost', function connect() {
  console.log('I have connected')
});
