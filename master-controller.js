var GPIO = require('onoff').Gpio;
var led = new GPIO(17, 'out');
var clients = [];

exports.connect = function(req, res) {
	var payload = req.body;

	console.log(payload);
	// create client if it does not already exist
	// update 
	res.json({
		client_id: 'acb123-abc123'
	});
};


exports.sysinfo = function(req, res) {
	var info = req.body;
	var client_id = req.params.client_id;

	info.client_id = client_id;

	clients.push(info);

	console.log( 'hostname: ' + info.hostname );
	console.log( 'local: ' + info.local );
	console.log( 'uptime: ' + info.uptime );

	res.json({status: 'ok'});
};


exports.clients = function(req, res) {
	res.json(clients);
};


exports.log = function(req, res, next) {
	flash();
	console.log(req.originalUrl + ' - ' + req.ip);
	next();
};


function flash() {
	led.writeSync(1);
	setTimeout(function(){
		led.writeSync(0);
	}, 500);
}