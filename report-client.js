var http   = require('http');
var http   = require('request-promise-json');
var diskinfo = require('./diskinfo-promise');
var util   = require('./util');
var WebSocket = require('ws');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var config = require('./slave-config.json');

function ReportClient() {

	var me = this;
	events.EventEmitter.call(this);

	me.ws;


	this.connect = function() {
		me.ws = new WebSocket(config.masterWsUrl);

		var payload = { 
			ip: util.getLocalIP(),	
			identifier: util.systemIdentifier()
		};

		me.ws.on('open', function open() {
			me.ws.send(payload);
		});
/*
		http.post(util.format('%s/connect', config.masterUrl), payload)
		.then(function(response) {
			me.emit('connected', response.cid);
		})
		.catch(function(err){
			me.emit('report.error', err);
		}); */
	};


	this.report = function(cid) {

		var reportSuccess = function(response) {
			me.emit('report.sent', response);
		};
		var reportError = function(err) {
			me.emit('report.error', err);
		};

		diskinfo.get().then(function(diskinfo) {

			//var url = util.format('%s/clients/%s/sysinfo', config.masterUrl, cid)
			var message = {
				cid        : cid,
				lastUpdate : new Date(),
				sysinfo    : util.sysinfo(),
				diskinfo   : diskinfo,
				config     : config
			};

			/*http.post(url, message)
			.then(reportSuccess)
			.catch(reportError); */

			me.ws.send(message);

		}).fail(reportError);
		
	};

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;