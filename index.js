var midi = require('midi');
var lifxClient = require('./lifx').init()

// Set up a new input.
var input = new midi.input();

// Count the available input ports.
input.getPortCount();

// Get the name of a specified input port.
input.getPortName(0);

// Configure a callback.
input.on('message', function(deltaTime, message) {
  var inputY = message[1]
  var light = lifxClient.light('All Lights') // TODO: pass target light as CLI param
  console.log('m:' + message + ' d:' + deltaTime);
  var xMax = 360;
  var xMin = 0;

  var yMax = 96;
  var yMin = 36;

  var percent = (inputY - yMin) / (yMax - yMin);
  var outputX = percent * (xMax - xMin) + xMin;

  if(message[0] == 144) {
    var lights = lifxClient.lights()
    lights.forEach(function(light) {
      light.color(Math.floor(outputX), 75, 50, 4000)
    })
  }
});

// Open the first available input port.
input.openPort(0);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

// Close the port when done.
// input.closePort();
