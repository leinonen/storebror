var http   = require('http');
var http   = require('request-promise-json');
var util   = require('./util');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var master_url   = process.argv[2] || 'http://127.0.0.1:8080';


function Client() {

	var me = this;
	events.EventEmitter.call(this);

	this.connect = function(payload) {
		http.post(util.format('%s/connect', master_url), payload)
		.then(function(response) {
			me.emit('connected', response.client_id);
		})
		.catch(console.error);
	};


	this.report = function(client_id) {

		util.diskinfo().then(function(diskinfo){
			http.post(util.format('%s/clients/%s/sysinfo', master_url, client_id), {
				lastUpdate: new Date(),
				sysinfo: util.sysinfo(),
				diskinfo: diskinfo
			})
			.then(function(response) {
				console.log('report sent: ' + response.status);
			})
			.catch(console.error);
		});
		
	};

}

Client.prototype.__proto__ = events.EventEmitter.prototype;


var client = new Client();

client.on('connected', function(client_id) {
	client.report(client_id);
});

client.connect({ 
	ip: util.getLocalIP(),	
	identifier: util.systemIdentifier()
});



