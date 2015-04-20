var exec = require('child-process-promise').exec;
var _ = require('lodash');
var Q = require('q');
var config = require('../slave/config/slave-config');

var output = '/dev/sda: WDC WD3200JB-00KFA0: 38°C\n' +
	'/dev/sdb: WDC WD5000AAKS-00TMA0: 39°C\n' +
	'/dev/sdc: SAMSUNG HD753LJ: 31°C\n' +
	'/dev/sdd: WDC WD1002FAEX-00Z3A0: 35°C\n' +
	'/dev/sde: WDC WD3200KS-00PFB0: 39°C\n' +
	'/dev/sdf: WDC WD1001FALS-00E8B0: 37°C\n' +
	'/dev/sdg: WDC WD1001FALS-00J7B0: 37°C\n' +
	'/dev/sdh: WDC WD5000AAKS-22TMA0: 35°C\n' +
	'/dev/sdi: WDC WD20EARX-00PASB0: 34°C\n' +
	'/dev/sdj: SAMSUNG SSD 830 Series: 33°C\n' +
	'/dev/sdk: WDC WD20EARX-00PASB0: 34°C\n' +
	'/dev/sdl: SAMSUNG HM500JI: 32°C\n';

exports.getHddTemp = function () {
	return execHddTemp();
};


function execHddTemp() {
/*	var cmd = 'sudo hddtemp ' + config.hddTemp.drives.join(' ');
	console.log('runnig ' + cmd);
	return exec(cmd).then(function (output) {
		return parse(output.stdout);
	}).fail(function (err) {
		console.error('error running hddtemp');
		console.error(err);
		return makePromise([]);
	});*/
	return makePromise( parse(output));
}

function makePromise(data) {
	var deferred = Q.defer();
	deferred.resolve(data);
	return deferred.promise;
}


function parse(stdout) {
	return stdout.split('\n').filter(function (row) {
		return row.length > 0;
	}).map(function (row) {
		var data = row.split(':');
		return {
			drive: data[0].trim(),
			temp: data[2].trim()
		}
	});
}

exports.parse = parse;