var os = require('os');
var util = require('util');
var crypto = require('crypto');


/**
 * Get a unique identifier for this system.
 * @returns {*}
 */
exports.getSystemIdentifier = function () {
	var identifier = util.format('%s-%s-%s',
		os.hostname(), os.platform(), os.release());
	return crypto.createHash('md5').update(identifier).digest('hex');
};


/**
 * Get the system information.
 * @returns {{local: *, hostname: *, type: *, platform: *, arch: *, release: *, uptime: *, loadavg: *, totalmem: *, freemem: *, cpus: *, networkInterfaces: *}}
 */
exports.getSystemInformation = function () {
	return {
		local: getLocalIP(),
		hostname: os.hostname(),
		type: os.type(),
		platform: os.platform(),
		arch: os.arch(),
		release: os.release(),
		uptime: formatUptime(os.uptime()),
		loadavg: os.loadavg(),
		totalmem: os.totalmem(),
		freemem: os.freemem(),
		cpus: os.cpus(),
		networkInterfaces: os.networkInterfaces()
	};
};


/**
 * Format the uptime from seconds to days hours and minutes.
 * @param seconds
 * @returns {string}
 */
function formatUptime(seconds) {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	return numdays + " days, " + numhours + " hours, " + numminutes + ' minutes';
}

/**
 * Get the local ip address of the machine.
 * @returns {string}
 */
function getLocalIP() {
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
