var os = require('os');
var util = require('util');
var crypto = require('crypto');
//var child_process = require('child_process');
var exec = require('child-process-promise').exec;
var _ = require('lodash');

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

function systemIdentifier(){
	var identifier = util.format('%s-%s-%s', 
		os.hostname(), os.platform(), os.release());
	return crypto.createHash('md5').update(identifier).digest('hex');
}

function sysinfo() {
	return {
		local:    getLocalIP(),
		hostname: os.hostname(),
		type:     os.type(),
		platform: os.platform(),
		arch:     os.arch(),
		release:  os.release(),
		uptime:   os.uptime(),
		loadavg:  os.loadavg(),
		totalmem: os.totalmem(),
		freemem:  os.freemem()
		//cpus: os.cpus(),
		//networkInterfaces: os.networkInterfaces()
	};
}

function getDriveData(items) {
	var result = {
		filesystem: items[0],
		size: items[1],
		used: items[2],
		avail: items[3]
	};

	if (items.length <= 7) {
		// Linux
		result.mounted = items[5];
	} else if (items.length <= 10) {
		// OSX
		result.mounted = items[8];
	}

	return result;
}

function parseDiskInfo(result) {
	var drives = [];
	var handleRow = function(row) {
		var columns = row.replace(/\s+/g, ' ').split(' ');
		if (columns.length > 1) {
			drives.push(getDriveData(columns));
		}
	};
	result.stdout.split('\n').forEach(handleRow);
	return drives;
}

function diskinfo() {
	return exec('df -h').then(parseDiskInfo);
}

exports.systemIdentifier = systemIdentifier;
exports.sysinfo = sysinfo;
exports.diskinfo = diskinfo;
exports.getLocalIP = getLocalIP;
exports.format = util.format;
