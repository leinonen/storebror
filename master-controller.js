var _      = require('lodash');
var GPIO   = require('onoff').Gpio;
var config = require('./master-config.json');
var diskinfo = require('./diskinfo-promise');

var clients = {};
var leds = {};

if (config.gpioEnabled) {
		leds.status = new GPIO(config.leds.status, 'out');
		leds.error  = new GPIO(config.leds.error, 'out');
		leds.test   = new GPIO(config.leds.test, 'out');
}


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
	var totals = _.pluck(_.pluck(clients, 'diskinfo'), 'totals')
		.reduceRight(diskinfo.sum);
	res.json(totals);
}


exports.config = function(req, res){
	res.json(config);
}


exports.logRequest = function(req, res, next) {
	flash();
	if (!isStatic(req.originalUrl)){
		console.log('REQ -> %s by %s', req.originalUrl, req.ip);
	}
	next();
};


// Helper functions 

function getClients() {
	
	var list = Object.keys(clients).map(function(client_id) {
		return clients[client_id];
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
	if (config.gpioEnabled) {
		leds.status.writeSync(1);
		setTimeout(function(){
			leds.status.writeSync(0);
		}, 250);
	}
}

function flashError() {
	if (config.gpioEnabled) {
		leds.error.writeSync(1);
		setTimeout(function(){
			leds.error.writeSync(0);
		}, 500);
	}
}

function flashTest() {
	if (config.gpioEnabled) {
		leds.test.writeSync(1);
		setTimeout(function(){
			leds.test.writeSync(0);
		}, 750);
	}
}