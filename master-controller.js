var _      = require('lodash');
var GPIO   = require('onoff').Gpio;
var config = require('./master-config.json');

var leds = {
		status: new GPIO(config.leds.status, 'out'),
		error:  new GPIO(config.leds.error, 'out'),
		test:   new GPIO(config.leds.test, 'out')
};

var clients = {};

exports.connect = function(req, res) {
	var payload = req.body;

	if (req.ip === payload.ip){
		console.log('Ip numbers match!');
	} else {
		console.log('Ip numbers does not match %s -> %s', req.ip, payload.ip);
	}

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
	//clients.push(info);
	clients[client_id] = info;

	console.log(clients);

	res.json({status: 'ok'});
};


exports.clients = function(req, res) {
	var list = [];
	Object.keys(clients).forEach(function(client_id) {
		console.log(client_id);
		console.log(clients[client_id]);
		list.push(clients[client_id]);
	});
	res.json(list);
};

exports.logRequest = function(req, res, next) {
	flash();
	if (!isStatic(req.originalUrl)){
		console.log('-> %s - %s', req.originalUrl, req.ip);
	}
	next();
};


// Helper functions 

function isStatic(url) {
	return _.contains(url, ['components','.js']);
}

function flash() {
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