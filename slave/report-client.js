var http = require('request-promise-json');
var diskinfo = require('../utils/diskinfo-promise');
var util = require('../utils/sysutils');
var WebSocket = require('ws');
var events = require('events');
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

		diskinfo.get().then(function (diskinfo) {

			var payload = JSON.stringify({
				cid: util.systemIdentifier(),
				lastUpdate: new Date(),
				sysinfo: util.sysinfo(),
				diskinfo: diskinfo,
				config: config
			});

			var masterUrl = util.format('ws://%s:%s/report', config.masterHost, config.masterPort);
			var ws = new WebSocket(masterUrl);

			ws.on('open', function () {
				ws.send(payload, function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log('message sent');
					}
				});
			});

			ws.on('message', function (data, flags) {
				console.log(data);
			});


		}).fail(reportError);

	};

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;