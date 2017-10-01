const WebSocket = require('ws');

const ws = new WebSocket('https://osc-relay.herokuapp.com/');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});


