const WebSocket = require('ws');
const osc = require('osc');

const ws = new WebSocket('https://osc-relay.herokuapp.com/');

////////////////////////////////////////////////////////////////

wss.on("connection", function (socket) {
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });
 
    socketPort.on("message", function (oscMsg) {
        console.log("An OSC Message was received!", oscMsg);
    });
});

///////////////////////////////////////////////////////////////

process.stdin.resume();
process.stdin.setEncoding('utf8');

ws.on('open', function open() {
  ws.send('ws opened');
});

process.stdin.on('data', function(message) {
  message = message.trim();
  ws.send(message, console.log.bind(null, 'Sent : ', message));
});

ws.on('message', function(message) {
  console.log('Received: ' + message);
//  udpPort.send(message);
});

ws.on('close', function(code) {
  console.log('Disconnected: ' + code);
});

ws.on('error', function(error) {
  console.log('Error: ' + error.code);
});
