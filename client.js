const net = require('net');
const EVENT_DATA = 'data'

var new_client = net.connect(6969, 'localhost', function connect() {
  console.log('enter your username')

  process.stdin.on(EVENT_DATA, function(data) {
    new_client.write(data);
  })

  new_client.on(EVENT_DATA, function(data) {
    process.stdout.write(data);
  })

});




