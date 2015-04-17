var http = require('request-promise-json');
var diskinfo = require('../utils/disk-info-promise');
var util = require('../utils/sysutils');
var WebSocket = require('ws');
var events = require('events');
var config = require('./config/slave-config');
var sys = require('../utils/sysinfo-promise');

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

		diskinfo.get().then(function (diskinfo) {

			return sys.getServices().then(function (services) {
				return {
					diskinfo: diskinfo,
					services: services
				}

			}).fail(function(err){
				// services only works on linux
				return {
					diskinfo: diskinfo,
					services: []
				}
			});

		}).then(function (data) {

			var payload = JSON.stringify({
				cid: util.systemIdentifier(),
				lastUpdate: new Date(),
				sysinfo: util.sysinfo(),
				diskinfo: data.diskinfo,
				services: data.services,
				config: config
			});

			send(payload);

		}).fail(reportError);

	};

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;