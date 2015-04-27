var packageJson = require('../../package.json');
module.exports = {

	version: packageJson.version,

	masterHost: '192.168.1.107',
	masterPort: 80,

	// How often to send reports (ms)
	reportInterval: 1000 * 30,

	excludedFilesystems: [
		'/dev/sda1'
	],

	// if you have hddtemp installed, you can enable it here
	// and specify the drives to read temperature from
	hddTemp: {
		enabled: false,
		drives: [
			'/dev/sda',
			'/dev/sdb',
			'/dev/sdc',
			'/dev/sdd',
			'/dev/sde',
			'/dev/sdf',
			'/dev/sdg',
			'/dev/sdh',
			'/dev/sdi',
			'/dev/sdj',
			'/dev/sdk',
			'/dev/sdl'
		]
	}
};