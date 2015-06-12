var exec = require('child-process-promise').exec;
var _ = require('lodash');
var os = require('os');
var Q = require('q');


exports.getServices = function () {
	if (os.platform() === 'linux' && os.arch() !== 'arm') {
		return getServicesLinuxInitctl();
	} else {
		return makePromise([]);
	}
};


function getServicesLinuxInitctl() {
	return exec('initctl list').then(parseOutput);
}


function parseOutput(response) {
	var rows = response.stdout.split('\n');
	return rows
		.map(extractInfo)
		//	.filter(isRunning)
		.sort(byName);
}

function extractInfo(row) {
	var arr = row.trim().split(',')[0].split(' ');
	return {
		name: arr[0],
		running: arr[1] === 'start/running'
	};
}

/*function isRunning(service) {
	return service.running === true;
}*/

function byName(a, b) {
	if (a.name > b.name) {
		return 1;
	}
	if (a.name < b.name) {
		return -1;
	}
	return 0;
}

function makePromise(data) {
	var deferred = Q.defer();
	deferred.resolve(data);
	return deferred.promise;
}
