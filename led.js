var GPIO = require('onoff').Gpio;
var led = new GPIO(18, 'out');

var status = true;

function ledStuff(){
	if (status){
		led.writeSync(1);
	} else {
		led.writeSync(0);
	}
	status = !status;
}

setInterval(ledStuff, 1000);