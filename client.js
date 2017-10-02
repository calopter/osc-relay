// Deps
const WebSocket = require('ws');
var prompt = require('prompt');

// Encoding
process.stdin.resume();
process.stdin.setEncoding('utf8');

// Check if user has a name
usernameSet = process.env.OSC_NAME_SET || "false";
username = process.env.OSC_NAME || "Unkown";

var devMode = false;
var ws = null; //yes....*null*!!!

// Parse command-line args. Will move into a function when necessary.
if (process.argv[2] == "-d") {
    devMode = true;
    var ws = new WebSocket('ws://localhost:8000');
} else {
    ws = new WebSocket('https://osc-relay.herokuapp.com/');
}


// Send an open notification
ws.on('open', function open() {
    ws.send('ws opened');
});

// After enter is pressed on std, send the message to the websocket.
process.stdin.on('data', function(message) {
    message = message.trim();
    if (usernameSet == false) {
        console.log("Username will be set to " + message + " for this session.\n");
        console.log("To set a perminant username, set the OSC_NAME_SET(boolean) & OSC_NAME (string) variables.")
        username = message;
        usernameSet = true;
    } else {
    name = "@" + username + ": ";
        ws.send(name + message);
    }
});

// Display broadcasted messages in cyan
ws.on('message', function(message) {
    console.log('\x1b[36m%s\x1b[0m', message);
});

ws.on('close', function(code) {
  console.log('Disconnected: ' + code);
});

ws.on('error', function(error) {
  console.log('Error: ' + error.code);
});
