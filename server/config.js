module.exports = {

	name: 'Pharatropic',

	port: 80,

	mongo: {
		url: '192.168.83.155:27017/storebror_dev',

		opts: {
			server: {
				socketOptions: {
					keepAlive: 1
				}
			}
		}
	},

	gpioEnabled: false,

	leds: {
		status: 17,
		error: 18,
		test: 14
	}
};