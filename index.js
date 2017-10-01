const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const port = process.env.PORT || 8000;

app.get('/', function(req, res) {
	res.send('Hello World');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(port, function () {
  console.log('Listening on %d', server.address().port)
});

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function (ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', function (message) {
    console.log('received: %s', message);
  });

  ws.send('heroku ws got a client');
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 30000);
