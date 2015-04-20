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
		collectSystemInformation().then(deliverMessage).fail(reportError);
	};


	function reportSuccess(response) {
		me.emit('report.sent', response);
	}

	function reportError(err) {
		me.emit('report.error', err);
	}

	function send(payload) {
		var masterUrl = util.format('ws://%s:%s/report', config.masterHost, config.masterPort);
		var ws = new WebSocket(masterUrl);
		ws.on('open', function () {
			ws.send(JSON.stringify(payload), function (err) {
				if (err) {
					reportError(err);
				} else {
					reportSuccess({status: 'ok'});
				}
			});
		});
		ws.on('error', reportError);
		ws.on('message', function (data, flags) {
			console.log(data);
		});
	}

	function deliverMessage(data) {
		var payload = {
			cid: system.getSystemIdentifier(),
			sysinfo: system.getSystemInformation(),
			drives: data.drives,
			services: data.services,
			lastUpdate: new Date(),
			config: config
		};
		// Use proper hostname instead
		payload.sysinfo.hostname = data.hostname;
		send(payload);
	}

	function collectSystemInformation() {
		return drives.get().then(function (drives) {
			return services.getServices().then(function (services) {
				return system.getHostname().then(function (hostname) {
					if (config.hddTemp.enabled) {
						return hddtemp.getHddTemp().then(function (temps) {
							return {
								drives: drives,
								hddtemp: temps,
								services: services,
								hostname: hostname
							}
						});
					} else {
						return {
							drives: drives,
							services: services,
							hostname: hostname
						}
					}
				});
			}).fail(function (err) {
				// probably initctl not working on this system
				return system.getHostname().then(function (hostname) {
					if (config.hddTemp.enabled) {
						return hddtemp.getHddTemp().then(function (temps) {
							return {
								drives: drives,
								hddtemp: temps,
								services: [],
								hostname: hostname
							}
						});
					} else {
						return {
							drives: drives,
							services: [],
							hostname: hostname
						}
					}
				});
			});
		});
	}

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;