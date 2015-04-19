var http = require('request-promise-json');
var util = require('util');
var events = require('events');
var WebSocket = require('ws');
var drives = require('../utils/drives');
var system = require('../utils/system');
var services = require('../utils/services');
var config = require('./config/slave-config');

function ReportClient() {

	var me = this;
	events.EventEmitter.call(this);

	this.report = function () {

		var reportSuccess = function (response) {
			me.emit('report.sent', response);
		};

		var reportError = function (err) {
			me.emit('report.error', err);
		};

		function send(payload) {
			var masterUrl = util.format('ws://%s:%s/report', config.masterHost, config.masterPort);
			var ws = new WebSocket(masterUrl);
			ws.on('open', function () {
				ws.send(payload, function (err) {
					if (err) {
						reportError(err);
					} else {
						reportSuccess({status: 'ok'});
					}
				});
			});
			ws.on('message', function (data, flags) {
				console.log(data);
			});
		}

		drives.get().then(function (drives) {
			return services.getServices().then(function (services) {
				return system.getHostname().then(function(hostname){
					return {
						drives: drives,
						services: services,
						hostname: hostname
					}
				});
			});
		}).then(function (data) {

			var payload = JSON.stringify({
				cid: system.getSystemIdentifier(),
				sysinfo: system.getSystemInformation(),
				drives: data.drives,
				services: data.services,
				lastUpdate: new Date(),
				config: config
			});

			// Use proper hostname instead
			payload.sysinfo.hostname = data.hostname;

			send(payload);

		}).fail(reportError);

	};

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;