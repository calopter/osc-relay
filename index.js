const WebSocket = require('ws');
const express = require('express');

const app = express();
const port = process.env.PORT;

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.listen(port, function () {
  console.log('started express')}
);

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message);
    ws.send('heroku heard: %s', message);
  });

  ws.send('heroku ws got a client');
});
