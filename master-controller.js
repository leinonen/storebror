var GPIO = require('onoff').Gpio;
var led = new GPIO(17, 'out');

var clients = {};

exports.log = function(req, res, next) {
	console.log(req.originalUrl);
	next();
};

exports.flash = function(req, res, next){
	led.writeSync(1); // on
	setTimeout(function(){
		led.writeSync(0); // off
	}, 1000);
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