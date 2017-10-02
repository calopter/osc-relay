// Deps
const WebSocket = require('ws');
var prompt = require('prompt');
const osc = require('osc');

// Encoding
process.stdin.resume();
process.stdin.setEncoding('utf8');

// Check if user has a name
usernameSet = process.env.OSC_NAME_SET || false;
username = process.env.OSC_NAME || "Unkown";

var devMode = false;
var ws = null; //yes....*null*!!!
var oscPort = null;

// Parse command-line args. Will move into a function when necessary.
if (process.argv[2] == "-d") {
    devMode = true;
    oscPort = new osc.WebSocketPort({
        url: "ws://localhost:8000"
    });
} else {
     oscPort = new osc.WebSocketPort({
         url: 'https://osc-relay.herokuapp.com/'
    });
   // ws = new WebSocket('https://osc-relay.herokuapp.com/');
}

// Open a port for OSC communication
oscPort.open();

// Send a connection  notification
oscPort.on("ready", function () {
    console.log("OSC port is ready and open.");
    oscPort.send({
        address: "/user/" + username + "/status",
        args: "connected"
    });
});


// After enter is pressed on std, send the message to the websocket.
process.stdin.on('data', function(message) {
    message = message.trim();
    var name = "";
    if (usernameSet == false) {
        console.log("Username will be set to " + message + " for this session.\n");
        console.log("To set a perminant username, set the OSC_NAME_SET(boolean) & OSC_NAME (string) variables.")
        username = message;
        usernameSet = true;
    } else {
    oscPort.send({
        address: "/user/" + username + "/instructions/",
        args: message
    });
    }
});

oscPort.on("osc", function (oscMsg) {
    if (oscMsg.address== "/user/" + username + "/instructions/"){
        return;
    } else {
        console.log(oscMsg);
    }
});

