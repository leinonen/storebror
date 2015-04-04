var GPIO = require('onoff').Gpio;
var led = new GPIO(17, 'out');

var status = true;

function ledStuff(){
	if (status){
		console.log('led on');
		led.writeSync(1);
	} else {
		console.log('led off');
		led.writeSync(0);
	}
	status = !status;
}

setInterval(ledStuff, 1000);
