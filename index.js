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

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message);
    ws.send('heroku heard: %s', message);
  });

  ws.send('heroku ws got a client');
});
