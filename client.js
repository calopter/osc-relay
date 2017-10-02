const WebSocket = require('ws');

const ws = new WebSocket('https://osc-relay.herokuapp.com/');

process.stdin.resume();
process.stdin.setEncoding('utf8');

ws.on('open', function open() {
    ws.send('ws opened');

});

process.stdin.on('data', function(message) {
    message = message.trim();
    ws.send(message);
    //console.log("\nMe: ")
});

ws.on('message', function(message) {
  console.log('Received: ' + message);
});

ws.on('close', function(code) {
  console.log('Disconnected: ' + code);
});

ws.on('error', function(error) {
  console.log('Error: ' + error.code);
});
