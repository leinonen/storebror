var GPIO = require('onoff').Gpio;
var led = new GPIO(17, 'out');

var clients = {};

function flashLed() {
	led.writeSync(1); // on
	setTimeout(function(){
		led.writeSync(0); // off
	}, 1000);
}

exports.report = function(req, res) {

	flashLed();

	var info = req.body;

	clients[info.local] = info;

	console.log( 'hostname: ' + info.hostname );
	console.log( 'local: ' + info.local );
	console.log( 'uptime: ' + info.uptime );
	res.json({status: 'ok', info:info});

};


exports.clients = function(req, res) {
	res.json(clients);
}