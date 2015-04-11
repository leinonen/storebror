var _    = require('lodash');
var GPIO = require('onoff').Gpio;
var leds = {
		status: new GPIO(17, 'out'),
		error:  new GPIO(18, 'out'),
		test:   new GPIO(14, 'out')
};

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

function isStatic(url) {
	return _.contains(url, ['components','.js']);
}

exports.log = function(req, res, next) {
	flash();
	if (!isStatic(req.originalUrl)){
		console.log('-> ' + req.originalUrl + ' - ' + req.ip);
	}
	next();
};

function flash(){
	flashStatus();
	flashError();
	flashTest();
}

function flashStatus() {
	leds.status.writeSync(1);
	setTimeout(function(){
		leds.status.writeSync(0);
	}, 500);
}

function flashError() {
	leds.error.writeSync(1);
	setTimeout(function(){
		leds.error.writeSync(0);
	}, 800);
}

function flashTest() {
	leds.test.writeSync(1);
	setTimeout(function(){
		leds.test.writeSync(0);
	}, 1000);
}