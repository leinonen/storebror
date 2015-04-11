var os     = require('os');
var util   = require('util');
var crypto = require('crypto');
var exec   = require('child-process-promise').exec;
var _      = require('lodash');

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
		freemem:  os.freemem(),
		cpus: os.cpus(),
		//networkInterfaces: os.networkInterfaces()
	};
}

function getDriveData(columns) {
	var result = {
		filesystem: columns[0],
		size:  columns[1],
		used:  columns[2],
		avail: columns[3]
	};
	if (columns.length <= 7) {
		// Linux
		result.mounted = columns[5];
	} else if (columns.length <= 10) {
		// OSX
		result.mounted = columns[8];
	}
	return result;
}

function parseDiskInfo(result) {
	var drives = [];
	result.stdout.split('\n').forEach(function(row) {
		var columns = row.trim().replace(/\s+/g, ' ').split(' ');
		drives.push(getDriveData(columns));
	});
	//filter out relevant drive details
	return drives.filter(function(drive){
		return drive.filesystem.indexOf('/dev') === 0;
	});
}

function diskinfo() {
	return exec('df -h').then(parseDiskInfo);
}

exports.systemIdentifier = systemIdentifier;
exports.sysinfo = sysinfo;
exports.diskinfo = diskinfo;
exports.getLocalIP = getLocalIP;
exports.format = util.format;
