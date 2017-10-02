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
var remotePort = null;

// Parse command-line args. Will move into a function when necessary.
if (process.argv[2] == "-d") {
    devMode = true;
    remotePort = new osc.WebSocketPort({
        url: "ws://localhost:8000"
    });
} else {
     remotePort = new osc.WebSocketPort({
         url: 'https://osc-relay.herokuapp.com/'
    });
   // ws = new WebSocket('https://osc-relay.herokuapp.com/');
}

// Local UDP port for routing osc to some other software.
var localPort = new osc.UDPPort({

    // This is the port we're listening on. Innactive feature currently
    localAddress: "127.0.0.1",
    localPort: 57121,

    // This is where whichever language is listening for OSC messages is listening.
    remoteAddress: "127.0.0.1",
    remotePort: 7770,
    metadata: true
});

// Open ports for remote and local communication
remotePort.open();
localPort.open();

// Send a connection  notification
remotePort.on("ready", function () {
    console.log("OSC port is ready and open.");
    remotePort.send({
        address: "/user/" + username + "/status",
        args: [
            {
                type: "f",
                value: Math.random()
            },
            {
                type: "s",
                value: "connected"
            }
        ]
    });
});

// After enter is pressed on std, send the message to the websocket.
// A note on the messages sent: `csound` in particular depends on a changing value for its
// 'puts' function. Basically a new value is pushed to 'puts' and it then prints the string.
// In order to ease interfacing with this functionality, all osc messages are prefixed by a
// random float. 
process.stdin.on('data', function(message) {
    message = message.trim();
    var name = "";
    if (usernameSet == false) {
        console.log("Username will be set to " + message + " for this session.\n");
        console.log("To set a perminant username, set the OSC_NAME_SET(boolean) & OSC_NAME (string) variables.")
        username = message;
        usernameSet = true;
    } else {
        remotePort.send({
            address: "/user/" + username + "/instructions/",
            args: [
                {
                    type: "f",
                    value: Math.random()
                },
                {
                    type: "s",
                    value: message
                }
            ]
        });

        // This is just for testing to make sure localPort works. Leaving uncommented for now.
        localPort.send({
            address: "/foo/bar",
            args: [
                {
                    type: "f",
                    value: Math.random()
                },
                {
                    type: "s",
                    value: message
                }
            ]
        });
    }
});

// When client recceives a message (broadcast), the args are printed to the console, and then passed to the local localPort
// Currently, we filter out messages sent from the user, which is not always the desired behavior.
remotePort.on("osc", function (oscMsg) {
    if (oscMsg.address== "/user/" + username + "/instructions/"){
        return;
    } else {
        console.log(oscMsg.args[1]);
    localPort.send({
        address: "/foo/bar",
        args: [
            {type: "f",
             value: oscMsg.args[0]},
            {type: "s",
             value: oscMsg.args[1]}
        ]
    });
    }
});

