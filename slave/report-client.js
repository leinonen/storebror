var http = require('request-promise-json');
var util = require('util');
var events = require('events');
//var WebSocket = require('ws');
var drives = require('../utils/drives');
var system = require('../utils/system');
var services = require('../utils/services');
var hddtemp = require('../utils/hddtemp');
var config = require('./config/slave-config');

function ReportClient() {

	var me = this;
	events.EventEmitter.call(this);

	me.clientID = null;

	this.connect = function(){
		sendConnect({cid: system.getSystemIdentifier()});
	};


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

		deliverMessage('system', system.getSystemInformation());

		deliverMessage('config', config);
	};


	function reportError(err){
		me.emit('report.error', err);
	}

	function sendConnect(payload){
		http
			.post(util.format('http://%s:%s/connect', config.masterHost, config.masterPort), payload)
			.then(function(response){
				me.emit('connect.success', {id: response.id});
			})
			.catch(function(err){
				me.emit('connect.error', err);
			});
	}

	function send(payload) {
		http
			.post(util.format('http://%s:%s/report', config.masterHost, config.masterPort), payload)
			.then(function(response){
				me.emit('report.sent', {type: payload.type});
			})
			.catch(function(err){
				me.emit('report.error', err);
			});
	}

	function deliverMessage(type, data) {
		send({
			clientID: me.clientID,
			cid: system.getSystemIdentifier(),
			version: config.version,
			type: type,
			data: data
		});
	}

}

ReportClient.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = ReportClient;