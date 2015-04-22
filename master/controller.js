var _ = require('lodash');

var config = require('./config/master-config');
var Client = require('./models/client');
var calculator = require('../utils/unitcalculator');

var leds = {};

var messageQueue = [];

if (config.gpioEnabled) {
	var GPIO = require('onoff').Gpio;
	leds.status = new GPIO(config.leds.status, 'out');
	leds.error = new GPIO(config.leds.error, 'out');
	leds.test = new GPIO(config.leds.test, 'out');
}

/**
 * Process incomming reports from client.
 * @param ws
 * @param req
 */
exports.report = function (ws, req) {
	ws.on('message', function (msg) {
		var report = JSON.parse(msg);

		if (report.cid === undefined ||
			report.type === undefined ||
			report.data === undefined){
			console.log('Invalid message recieved from ' + req.ip);
			return;
		}

		Client
			.findOne({cid: report.cid})
			.exec(function (err, client) {
				if (err) {
					console.error(err);
				} else {
					handleReport(client, report);
				}
			});

		flash();
	});
};


function parseVersion(input){
	var v = input.split('.');
	return {major: v[0], minor:v[1], patch:v[1]}
}


function handleReport(client, report) {
	if (client !== null) {

		console.log('updating %s with %s', report.cid, report.type);
		//console.log(report.data);

		if (report.type === 'drives') {
			client.drives = report.data;
		} else if (report.type === 'services') {
			client.services = report.data;
		} else if (report.type === 'hostname') {
			client.hostname = report.data;
		} else if (report.type === 'hddtemp') {
			client.hddtemp = report.data;
		} else if (report.type === 'sysinfo') {
			client.sysinfo = report.data;
		} else {
			console.log('wrong type! %s', report.type);
			return;
		}

		client.lastUpdate = new Date();

		client.save();

	} else {
		var newClient = new Client({cid: report.cid,lastUpdate: new Date()
		});
		newClient.save();
		console.log('new client joined the party: %s', report.cid);
	}
}

function isLessThanTwoHoursOld(client) {
	if (client.lastUpdate === undefined){
		return true;
	}
	var now = new Date();
	var reportDate = new Date(client.lastUpdate);
	var hours = Math.abs(now - reportDate) / (60 * 60 * 1000);
	return hours < 2.0;
}

exports.clients = function (req, res) {
	Client
		.find()
		.exec(function (err, list) {
			res.json(list.filter(isLessThanTwoHoursOld));
		});
};


exports.stats = function (req, res) {
/*	Client
		.find()
		.exec(function (err, clients) {

			var totals = _.pluck(_.pluck(_.pluck(clients.filter(isLessThanTwoHoursOld), 'data'), 'drives'), 'totals');

			res.json({
				size: calculator.sum(_.pluck(totals, 'size')),
				used: calculator.sum(_.pluck(totals, 'used')),
				avail: calculator.sum(_.pluck(totals, 'avail'))
			});
		});*/
	res.json([]);
};


exports.config = function (req, res) {
	res.json(config);
};


exports.logRequest = function (req, res, next) {
	/*if (!isStatic(req.originalUrl)) {
	 console.log('REQ -> %s by %s', req.originalUrl, req.ip);
	 }*/
	next();
};


// Helper functions 


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