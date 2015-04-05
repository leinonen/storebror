// slave
// gather info about the system and send to master
// TODO

var os = require('os');
var http = require('http');
var request = require('request');
var rp = require('request-promise');

var master_url = process.argv[2] || 'http://127.0.0.1:8080';

function getLocalIP(){
	var ifaces = os.networkInterfaces();
	var result = '';

	Object.keys(ifaces).forEach(function (ifname) {
	  var alias = 0;

	  ifaces[ifname].forEach(function (iface) {
	    if ('IPv4' !== iface.family || iface.internal !== false) {
	      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	      return;
	    }

	    if (alias >= 1) {
	      // this single interface has multiple ipv4 addresses
	      //console.log(ifname + ':' + alias, iface.address);
	    } else {
	      // this interface has only one ipv4 adress
	      //console.log(ifname, iface.address);
	      result = iface.address;
	    }
	  });
	});
	return result;
}

function sysinfo() {
	return {
		local: getLocalIP(),
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

	post('/connect', {test:123})
		.then(function(response){
			console.log(response);
		})
		.catch(console.error);

}


function report() {
	console.log('sending report to master');

	request
	.post(master_url + '/report', {form:sysinfo()})
	.on('error', function(err){
		console.log(err);
	});
}

//console.log('slave started on ' + os.hostname())
//setInterval(report, 10000);
//report();
connect();
