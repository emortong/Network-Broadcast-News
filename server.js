const net = require('net');
const readline = require('readline');
const bannedWords = require('./bannedWords.js');
const EVENT_DATA = 'data';
const EVENT_ERROR = 'error';
const EVENT_END = 'end';
const PORT = 6969;
let storedSockets = [];
let bannedWordsObj = {};
let kickedOut = false;
let found = false;

//converts bannedWords array into object
bannedWords.forEach((word) => {
  bannedWordsObj[word] = null;
})

let server = net.createServer(function connect(socket) {
  socket.on(EVENT_ERROR, (err) => {
    throw err;
  })

  socket.on(EVENT_DATA, function(data) {
    found = false;
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

    // verify language
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

  //disconnected or kicked out
  socket.on(EVENT_END, function() {
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
process.stdin.on(EVENT_DATA, function(data) {
  let message = `ADMIN says: ${data}\n`;
  storedSockets.forEach((x) => {
    x.socket.write(message);
  })
})

server.on(EVENT_ERROR, (err) => {
  throw err;
})

server.listen(PORT, () => {
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