var http = require('request-promise-json');
var util = require('util');
var events = require('events');
var WebSocket = require('ws');
var drives = require('../utils/drives');
var system = require('../utils/system');
var services = require('../utils/services');
var hddtemp = require('../utils/hddtemp');
var config = require('./config/slave-config');

function ReportClient() {

	var me = this;
	events.EventEmitter.call(this);

	this.report = function () {
		drives.get().then(function (drives) {
			deliverMessage('drives', drives);
		}).fail(reportError);

		services.getServices().then(function (services) {
			deliverMessage('services', services);
		}).fail(reportError);

		system.getHostname().then(function (hostname) {
			deliverMessage('hostname', hostname);
		}).fail(reportError);

		if (config.hddTemp.enabled) {
			hddtemp.getHddTemp().then(function (temp) {
				deliverMessage('hddtemp', temp);
			}).fail(reportError);
		}

		deliverMessage('sysinfo', system.getSystemInformation());
	};


	function reportSuccess(response) {
		me.emit('report.sent', response);
	}

	function reportError(err) {
		me.emit('report.error', err);
	}

	function socketError(err) {
		me.emit('report.ws.error', err);
	}

	function send(payload) {
		var ws = new WebSocket(util.format('ws://%s:%s/report', config.masterHost, config.masterPort));
		ws.on('open', function () {
			ws.send(JSON.stringify(payload), function (err) {
				if (err) {
					socketError(err);
				} else {
					reportSuccess({status: payload.type + ' sent successfully.'});
				}
			});
		});
		ws.on('error', socketError);
		ws.on('message', function (data, flags) {
			// Handle messages from the server
			console.log('GOT MESSAGE FROM SERVER');
			console.log(data);
		});
	}

	function deliverMessage(type, data) {
		send({
			cid: system.getSystemIdentifier(),
			version: config.version,
			type: type,
			data: data
		});
	}

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;