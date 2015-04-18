var _ = require('lodash');

var config = require('./config/master-config');
var Client = require('./models/client');
var calculator = require('../utils/unitcalculator');

//var clients = {};
var leds = {};

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

		Client
			.findOne({cid: report.cid})
			.exec(function (err, client) {
				if (err) {
					// save new client
					console.error(err);
				} else {

					if (client !== null) {
						console.log('updating %s', report.cid);
						client.data = report;
						client.save();
					} else {
						var newClient = new Client({cid: report.cid, data: report});
						newClient.save();
						console.log('saving new client: %s', report.cid);
					}
				}
			});

		flash();
	});
};


exports.clients = function (req, res) {
	Client
		.find()
		.exec(function (err, list) {
			res.json(list);
		});
};


exports.stats = function (req, res) {
	Client
		.find()
		.exec(function (err, clients) {

			var totals = _.pluck(_.pluck(_.pluck(clients, 'data'), 'drives'), 'totals');

			res.json({
				size: calculator.sum(_.pluck(totals, 'size')),
				used: calculator.sum(_.pluck(totals, 'used')),
				avail: calculator.sum(_.pluck(totals, 'avail'))
			});
		});
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