const fs = require('fs');
var socket = require('socket.io-client')('https://pro3-robot.herokuapp.com/');

console.log("#Export LED GPIO pin");
//fs.writeFileSync("/sys/class/gpio/export","61");
fs.writeFileSync("/sys/class/gpio/gpio61/direction", "out");

led_blinker.led = false; //Current LED state
led_blinker.state = "flashing"; //flashing, on or off
function led_blinker() {
  if(led_blinker.state === "flashing") {
    led_blinker.led = (led_blinker.led) ? false : true;
  } else if(led_blinker.state === "on") {
    led_blinker.led = true;
  } else if(led_blinker.state === "off") {
    led_blinker.led = false;
  } 
  fs.writeFileSync("/sys/class/gpio/gpio61/value", led_blinker.state? "1" : "0");
  console.log("LED is:",led_blinker.led);
}

setInterval(led_blinker, 500); //Periodic blinker

socket.on('connect', function(){
    console.log("#Connected!");
    led_blinker.state = "on";
});

socket.on('start', function(){
    console.log("START");
});

socket.on('move', function(force, angle){
    console.log("MOVE,"+angle+","+force);
});

socket.on('end', function(){
    console.log("END");
});

socket.on('disconnect', function(){
    led_blinker.state = "flashing";
    console.log("END");
    console.log("#Disconnected from server");
});
