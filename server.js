const net = require('net');
const readline = require('readline');
const bannedWords = require('./bannedWords.js');
let bannedWordsObj = {};
let kickedOut = false;

bannedWords.forEach((word) => {
  bannedWordsObj[word] = null;
})

let storedSockets = [];

let server = net.createServer(function connect(socket) {
  socket.on('error', (err) => {
    throw err;
  })

  socket.on('data', function(data) {
    let found = false;
    kickedOut = false;
    data = data.toString().trim();
    //identifying which client sent data
    storedSockets.forEach((x) => {
      if(x.socket === socket && x.id !== undefined) {
        let message = `${x.id} says: ${data}\n`;
        broadcast(message, socket);
        found = true;
      }
    })

    let wordsToVerify = data.toLowerCase().split(' ');
        wordsToVerify.forEach((toVerify) => {
          if(bannedWordsObj.hasOwnProperty(toVerify)) {
            socket.write(`you've been kicked out\n`);
            socket.end();
            kickedOut = true;
          }
        })

    //if new client, store it and welcome it on chat
    if(!found) {
      storeSocket(socket, data);
      let message = `${data} joined the chat\n`
      if(!broadcast(message, socket)) {
        socket.write(`you've joined the chat\n`)
      }
    }
  })

  socket.on('end', function() {
    let message;
    for(let i = 0; i < storedSockets.length; i++) {
      if(storedSockets[i].socket === socket) {
        if(!kickedOut) {
          message = `${storedSockets[i].id} disconnected\n`;
        } else {
          message = `${storedSockets[i].id} has been kicked out for not being nice\n`
        }
        broadcast(message,socket);
        storedSockets.splice(i,1);
      }
    }
  })

  server.getConnections(function(err, count) {
  console.log('Connections: ' + count)
})


});
// admin broadcast message
process.stdin.on('data', function(data) {
  let message = `ADMIN says: ${data}`;
  storedSockets.forEach((x) => {
    x.socket.write(message);
  })
})

server.on('error', (err) => {
  throw err;
})

server.listen(6969, () => {
  console.log('opened server on', server.address())
})

function storeSocket(socket, id) {
  let socketId = {
    socket: socket,
    id: id
  }
  storedSockets.push(socketId);
}

function broadcast(message, socket) {
  storedSockets.forEach((i) => {
    if(i.socket !== socket) {
      i.socket.write(message);
    } else {
      return false;
    }
  })
}