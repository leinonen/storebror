var http      = require('http');
var http      = require('request-promise-json');
var diskinfo  = require('./diskinfo-promise');
var util      = require('./util');
var WebSocket = require('ws');
var events    = require('events');
var emitter   = new events.EventEmitter();
var config    = require('./slave-config.json');

function ReportClient() {

	var me = this;
	events.EventEmitter.call(this);


	this.report = function() {

		var reportSuccess = function(response) {
			me.emit('report.sent', response);
		};
		var reportError = function(err) {
			me.emit('report.error', err);
		};

		diskinfo.get().then(function(diskinfo) {
			var payload = JSON.stringify({
				cid        : util.systemIdentifier(),
				lastUpdate : new Date(),
				sysinfo    : util.sysinfo(),
				diskinfo   : diskinfo,
				config     : config
			});
			var ws = new WebSocket(config.masterWsUrl + '/report');
			ws.on('open', function() {
				ws.send(payload, function(err){
					if (err) {
						console.log('report error');
						console.log(err);
					} else {
						console.log('message sent');
					}
				});
			});
			ws.on('message', function(data, flags){
				console.log(data);
			});

			/*http.post(url, message)
			.then(reportSuccess)
			.catch(reportError); */

		}).fail(reportError);
		
	};

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;