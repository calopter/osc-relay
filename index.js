const WebSocket = require('ws');
const osc = require('ws');

const port = process.env.PORT || 8000;
const wss = new WebSocket.Server({ port });

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function (ws) {
  var oscSocket = new osc.WebSocketPort({
      socket: ws
  });

  oscSocket.on("message", function (oscMsg) {
      console.log("An OSC Message was received!", oscMsg);

      wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
  });
  
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', function (message) {
    console.log('received: %s', message);

    });
  });
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 30000);
