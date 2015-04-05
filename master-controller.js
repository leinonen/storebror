var GPIO = require('onoff').Gpio;
var led = new GPIO(17, 'out');

var clients = {};

function flash(){
	led.writeSync(1); // on
	console.log('led on');
	setTimeout(function(){
		led.writeSync(0); // off
		console.log('led off');
	}, 1000);
}

exports.log = function(req, res, next) {
	flash();
	console.log(req.originalUrl + ' - ' + req.ip);
	next();
};



exports.report = function(req, res) {
	var info = req.body;

	clients['' + info.local] = info;

	console.log( 'hostname: ' + info.hostname );
	console.log( 'local: ' + info.local );
	console.log( 'uptime: ' + info.uptime );
	res.json({status: 'ok', info:info});

};


exports.clients = function(req, res) {
	res.json(clients);
};

exports.connect = function(req, res) {
	var payload = req.body;
	res.json({
		client_id: '123'
	});
};