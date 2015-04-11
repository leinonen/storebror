var http   = require('http');
var http   = require('request-promise-json');
var util   = require('./util');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var master_url   = process.argv[2] || 'http://127.0.0.1:8080';


function Client() {

	var me = this;
	events.EventEmitter.call(this);



	this.connect = function() {
		var payload = { 
			ip: util.getLocalIP(),	
			identifier: util.systemIdentifier()
		};

		http.post(util.format('%s/connect', master_url), payload)
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

		util.diskinfo()
		.then(function(diskinfo) {

			var url = util.format('%s/clients/%s/sysinfo', master_url, client_id)
			var message = {
				lastUpdate: new Date(),
				sysinfo: util.sysinfo(),
				diskinfo: diskinfo
			};

			http.post(url, message)
			.then(reportSuccess)
			.catch(reportError);

		})
		.fail(reportError);
		
	};

}

Client.prototype.__proto__ = events.EventEmitter.prototype;


var client = new Client();

client.on('connected', function(client_id) {
	client.report(client_id);
});

client.on('report.sent', function(response) {
	console.log('report sent: ' + response.status);
});

client.on('report.error', function(err) {
	console.error(err);
});

client.connect();



