const WebSocket = require('ws');
const osc = require("osc");
const port = process.env.PORT || 8000;
const wss = new WebSocket.Server({ port });
var ports = [];
function heartbeat() {
    this.isAlive = true;
}

// Listen for Web Socket connections. 
wss.on("connection", function (socket) {
    socket.isAlive = true;
    socket.on('pong', heartbeat);
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });
    ports.push(socketPort);
    console.log( "number of ports (doubled): " + ports.length);
    socketPort.on("message", function (oscMsg) {
        console.log("An OSC Message was received!", oscMsg);

        for (i = 0; i < ports.length; i++){
            ports[i].send(oscMsg);
        }
    });
});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping('', false, true);
    });
}, 30000);
