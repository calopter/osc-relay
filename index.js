const WebSocket = require('ws');
const express = require('express');

const app = express.createServer();
const port = process.env.PORT;

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.listen(port);

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message);
    ws.send('heroku heard: %s', message);
  });

  ws.send('heroku ws got a client');
});
