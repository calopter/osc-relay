const WebSocket = require('ws');
const osc = require("osc");
const port = process.env.PORT || 8000;
const wss = new WebSocket.Server({ port });
var ports = [];
function heartbeat() {
    this.isAlive = true;
}


// Listen for Web Socket connections. 
wss.on("connection", function (socket, req) {

    // Check for errors
    socket.on("error", (err) =>  {
        console.log("Error in socket init:  ");
        console.log(err.stack); });

    // Do a ping-pong to keep server alive
    socket.isAlive = true;
    socket.on('pong', heartbeat);

    // Init socket, push it into a list, which will handle broadcasting and disconnecting.
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });
    ports.push(socketPort);
    console.log( "number of users " + ports.length);

    // When a message is gotten, broadcast it to all other ports
    socketPort.on("message", function (oscMsg) {
        console.log("An OSC Message was received!", oscMsg);

        for (i = 0; i < ports.length; i++){
            ports[i].send(oscMsg);
        }
    });

    // When a socket closes, remove it from the array so that it is not sent messages
    socketPort.on("close", function (msg){
        console.log("A user disconnected.");
        for (i = 0; i < ports.length; i++){
            if (socketPort == ports[i]) {
                ports.splice(i, 1);
            }
        }
    });
});


// Ping Pong Code
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping('', false, true);
    });
}, 30000);
