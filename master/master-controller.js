var _ = require('lodash');
var GPIO = require('onoff').Gpio;
var config = require('./config/master-config');
var diskinfo = require('../utils/disk-info-promise');

var clients = {};
var leds = {};

if (config.gpioEnabled) {
	leds.status = new GPIO(config.leds.status, 'out');
	leds.error = new GPIO(config.leds.error, 'out');
	leds.test = new GPIO(config.leds.test, 'out');
}


exports.connect = function (ws, req) {
	ws.on('message', function (msg) {
		var client = JSON.parse(msg);
		console.log('client connected: %s', client.identifier);
		flash();
	});
};

exports.report = function (ws, req) {
	ws.on('message', function (msg) {
		var report = JSON.parse(msg);
		clients[report.cid] = report;
		console.log('got data from %s', report.cid);
		flash();
	});
};


exports.clients = function (req, res) {
	var list = getClients();
	res.json(list);
};


exports.stats = function (req, res) {
	var totals = _.pluck(_.pluck(clients, 'diskinfo'), 'totals');
	if (totals.length > 0) {
		res.json(totals.reduceRight(diskinfo.sum));
	} else {
		res.json([]);
	}
};


exports.config = function (req, res) {
	res.json(config);
};


exports.logRequest = function (req, res, next) {
	if (!isStatic(req.originalUrl)) {
		console.log('REQ -> %s by %s', req.originalUrl, req.ip);
	}
	next();
};


// Helper functions 

function getClients() {
	return Object.keys(clients).map(function (cid) {
		return clients[cid];
	});
}


function isStatic(url) {
	return _.contains(url, ['components', '.js']);
}

function flash() {
	flashStatus();
	flashError();
	flashTest();
}

function flashStatus() {
	if (config.gpioEnabled) {
		leds.status.writeSync(1);
		setTimeout(function () {
			leds.status.writeSync(0);
		}, 100);
	}
}

function flashError() {
	if (config.gpioEnabled) {
		leds.error.writeSync(1);
		setTimeout(function () {
			leds.error.writeSync(0);
		}, 200);
	}
}

function flashTest() {
	if (config.gpioEnabled) {
		leds.test.writeSync(1);
		setTimeout(function () {
			leds.test.writeSync(0);
		}, 300);
	}
}