var http   = require('http');
var http   = require('request-promise-json');
var diskinfo = require('./diskinfo-promise');
var util   = require('./util');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var config = require('./slave-config.json');

function ReportClient() {

	var me = this;
	events.EventEmitter.call(this);



	this.connect = function() {
		var payload = { 
			ip: util.getLocalIP(),	
			identifier: util.systemIdentifier()
		};

		http.post(util.format('%s/connect', config.masterUrl), payload)
		.then(function(response) {
			me.emit('connected', response.client_id);
		})
		.catch(function(err){
			me.emit('report.error', err);
		});
	};


	this.report = function(client_id) {

		var reportSuccess = function(response) {
			me.emit('report.sent', response);
		};
		var reportError = function(err) {
			me.emit('report.error', err);
		};

		diskinfo.get().then(function(diskinfo) {

			var url = util.format('%s/clients/%s/sysinfo', config.masterUrl, client_id)
			var message = {
				lastUpdate : new Date(),
				sysinfo    : util.sysinfo(),
				diskinfo   : diskinfo,
				config     : config
			};

			http.post(url, message)
			.then(reportSuccess)
			.catch(reportError);

		}).fail(reportError);
		
	};

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;