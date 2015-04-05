var _ = require('lodash');
var GPIO = require('onoff').Gpio;
var led = new GPIO(17, 'out');
var clients = [];

exports.connect = function(req, res) {
	var payload = req.body;

	console.log('client connected:');
	console.log(payload);

	var identifier = payload.identifier;
 
	res.json({ client_id: identifier });
};


exports.sysinfo = function(req, res) {
	var info = req.body;
	var client_id = req.params.client_id;

	info.client_id = client_id;

	// save to database :P
	clients.push(info);

	console.log(info);

	res.json({status: 'ok'});
};


exports.clients = function(req, res) {
	res.json(clients);
};

function isStatic(url){
	return _.contains(['components','.js'], url);
}

exports.log = function(req, res, next) {
	flash();
	if (!isStatic(req.originalUrl)){
		console.log('-> ' + req.originalUrl + ' - ' + req.ip);
	}
	next();
};


function flash() {
	led.writeSync(1);
	setTimeout(function(){
		led.writeSync(0);
	}, 500);
}