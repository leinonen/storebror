var http = require('http');
var request = require('request');
var rp = require('request-promise');
var util = require('./util');
var events = require('events');
var eventEmitter = events.eventEmitter();
var master_url = process.argv[2] || 'http://127.0.0.1:8080';


eventEmitter.on('connect', connect);
eventEmitter.on('report', report);

eventEmitter.emit('connect');
// ---------------------


function sysinfo() {
	return {
		local: util.getLocalIP(),
		hostname: os.hostname(),
		type: os.type(),
		platform: os.platform(),
		arch: os.arch(),
		release: os.release(),
		uptime: os.uptime(),
		loadavg: os.loadavg(),
		totalmem: os.totalmem(),
		freemem: os.freemem()
		//cpus: os.cpus(),
		//networkInterfaces: os.networkInterfaces()
	};
}

function post(uri, data) {	
	return rp({ 
		uri: master_url + uri, 
		method: 'POST',
		form: data
	});
}

function connect() {
	console.log('connecting to master');

	post('/connect', {
		ip: util.getLocalIP(),
		test: 'hej'
	})
	.then(function(response){
		console.log(response);
		eventEmitter.emit('report', 'slask');
	})
	.catch(console.error);
}


function report(client_id) {
	console.log('sending report to master for client %s', client_id);

	post(util.format('/clients/%s/sysinfo', client_id), sysinfo())
	.then(function(response){
		console.log(response.status);
	})
	.catch(console.error);
}


