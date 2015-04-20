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
		collectSystemInformation(); //.then(deliverMessage).fail(reportError);
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
					reportSuccess({status: payload.type + ' sent successfully.'});
				}
			});
		});
		ws.on('error', reportError);
		ws.on('message', function (data, flags) {
			console.log(data);
		});
	}

	function deliverMessage(type, data) {
		/*var payload = {
		 cid: system.getSystemIdentifier(),
		 sysinfo: system.getSystemInformation(),
		 drives: data.drives,
		 services: data.services,
		 lastUpdate: new Date(),
		 config: config
		 }; */
		// Use proper hostname instead
		//payload.sysinfo.hostname = data.hostname;

		send({
			cid: system.getSystemIdentifier(),
			data: data,
			type: type
		});
	}

	function collectSystemInformation() {

		drives.get().then(function (drives) {
			deliverMessage('drives', drives);
		}).fail(console.error);

		services.getServices().then(function (services) {
			deliverMessage('services', services);
		}).fail(console.error);

		system.getHostname().then(function (hostname) {
			deliverMessage('hostname', hostname);
		}).fail(console.error);

		if (config.hddTemp.enabled) {
			hddtemp.getHddTemp().then(function (temp) {
				deliverMessage('hddtemp', temp);
			}).fail(console.error);
		}

		deliverMessage('sysinfo', system.getSystemInformation());

		/*

		 return drives.get().then(function (drives) {
		 return services.getServices().then(function (services) {
		 return system.getHostname().then(function (hostname) {
		 if (config.hddTemp.enabled) {
		 return hddtemp.getHddTemp().then(function (temps) {
		 console.log('hddtemp is enabled and works flawlessly!');
		 console.log(temps);
		 return {
		 drives: drives,
		 hddtemp: temps,
		 services: services,
		 hostname: hostname
		 }
		 }).fail(function (err) {
		 console.error('hddtemp failed');
		 console.error(err);
		 return {
		 drives: drives,
		 hddtemp: [],
		 services: services,
		 hostname: hostname
		 }
		 });
		 } else {
		 console.log('hddtemp is not enabled, so using empty result');
		 return {
		 drives: drives,
		 hddtemp: [],
		 services: services,
		 hostname: hostname
		 }
		 }
		 });
		 }).fail(function (err) {
		 // probably initctl not working on this system
		 console.error('error running initctl');
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
		 hddtemp: [],
		 services: [],
		 hostname: hostname
		 }
		 }
		 });
		 });
		 });
		 */
	}

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;