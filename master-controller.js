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
	console.log('client connected: %s', payload.identifier);
	res.json({ client_id: payload.identifier });
};


exports.sysinfo = function(req, res) {
	var info = req.body;
	var client_id = req.params.client_id;
	info.client_id = client_id;
	clients[client_id] = info;
	console.log('got sysinfo from %s', client_id);
	res.json({status: 'ok'});
};




exports.clients = function(req, res) {
	var list = getClients();
	res.json(list);
};


exports.stats = function(req, res) {
	var list = getClients();
	var result = _.pluck(list, 'diskinfo').pluck('totals');
	res.json(result);
}

exports.logRequest = function(req, res, next) {
	flash();
	if (!isStatic(req.originalUrl)){
		console.log('REQ -> %s by %s', req.originalUrl, req.ip);
	}
	next();
};


// Helper functions 

function getClients(){
	var list = [];
	Object.keys(clients).forEach(function(client_id) {
		list.push(clients[client_id]);
	});
	return list;
}


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
	}, 250);
}

function flashError() {
	leds.error.writeSync(1);
	setTimeout(function(){
		leds.error.writeSync(0);
	}, 500);
}

function flashTest() {
	leds.test.writeSync(1);
	setTimeout(function(){
		leds.test.writeSync(0);
	}, 750);
}