var packageJson = require('../../package.json');
module.exports = {

	version: packageJson.version,

	masterHost: '192.168.1.107',
	masterPort: '80',

	// How often to send reports (ms)
	reportInterval: 1000 * 30,

	excludedFilesystems: [
		'/dev/sda1'
	]
};