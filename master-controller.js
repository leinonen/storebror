//var GPIO = require('onoff').Gpio;
//var led = new GPIO(18, 'out');
//led.writeSync(1); // on
//led.writeSync(0); // off

var clients = {};

exports.report = function(req, res) {

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