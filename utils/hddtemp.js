var exec = require('child-process-promise').exec;
var _ = require('lodash');
var Q = require('q');
var config = require('../slave/config/slave-config');

exports.getHddTemp = function () {
	return execHddTemp();
};


function execHddTemp() {
	var cmd = 'sudo hddtemp ' + config.hddTemp.drives.join(' ');
	console.log('runnig ' + cmd);
	return exec(cmd).then(function (output) {
		return parse(output.stdout);
	}).fail(function (err) {
		console.error('error running hddtemp');
		console.error(err);
		return makePromise([]);
	});
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