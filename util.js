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

// Convert "522G" -> {unit: 'G', value: 522}
// Also convert terrabyte to gigabyte
function parseUnit(str){
	str = str.replace('i',''); // OSX..
	var unit = str.substr(str.length - 1);
	var value = parseFloat( str.replace(unit, '') );
	if (unit === 'T') {
		unit = 'G';
		value *= 1000;
	}
	return {
		unit: unit,
		value: value
	}
}


function driveSummary(drives){
	return _(drives)
	.map(function(x){
		return {
			size: parseUnit(x.size),
			used: parseUnit(x.used),
			avail: parseUnit(x.avail)
		}
	})
	.reduceRight(function(a,b){
		return {
			size: {
				value: a.size.value + b.size.value,
				unit: a.size.unit
			},
			used: {
				value: a.used.value + b.used.value,
				unit: a.used.unit
			},
			avail: {
				value: a.avail.value + b.avail.value,
				unit: a.avail.unit
			}
		};
	});
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
	var filtered = drives.filter(function(drive) {
		return drive.filesystem.indexOf('/dev') === 0;
	});
	return {
		drives: filtered,
		totals: driveSummary(filtered)
	}
}

function diskinfo() {
	return exec('df -h').then(parseDiskInfo);
}

// Exported functions

exports.driveSummary = driveSummary;
exports.systemIdentifier = systemIdentifier;
exports.sysinfo = sysinfo;
exports.diskinfo = diskinfo;
exports.getLocalIP = getLocalIP;
exports.format = util.format;
