// slave
// gather info about the system and send to master
// TODO

var os = require('os');
//var querystring = require('querystring');
var http = require('http');

function post(url, data) {
	var postData = JSON.stringify(data);
	
	var options = {
	  hostname: '127.0.0.1',
	  port: 8080,
	  path: '/upload',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': postData.length
	  }
	};

	var req = http.request(options, function(res) {
	//  console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  
	  var resp = '';

	  res.on('data', function (chunk) {
	    //console.log('BODY: ' + chunk);
	  	resp += chunk;
	  });

	  res.on('end', function(e) {
	  	console.log(resp);
		});
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	  process.exit();
	});

	// write data to request body
	req.write(postData);
	req.end();
}

function sysinfo() {
	return {
		hostname: os.hostname(),
		type: os.type(),
		platform: os.platform(),
		arch: os.arch(),
		release: os.release(),
		uptime: os.uptime(),
		loadavg: os.loadavg(),
		totalmem: os.totalmem(),
		freemem: os.freemem(),
		cpus: os.cpus(),
		networkInterfaces: os.networkInterfaces()
	};
}

function sendToMaster() {
	console.log('about to send data to master');
	post('', sysinfo());
}


console.log('slave started on ' + os.hostname())

setInterval(sendToMaster, 10000);