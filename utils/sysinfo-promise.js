'use strict';

var exec = require('child-process-promise').exec;
var _ = require('lodash');
var os = require('os');
var Q = require('q');


// Public methods

exports.getServices = function () {
	if (os.platform() === 'linux') {
		return getServicesLinux();
	} else {
		return makeErrorPromise('getServices: only implemented for linux');
	}
};


// Helpers


function extractInfo(row) {
	var arr = row.trim().split(',')[0].split(' ');
	return {
		name: arr[0],
		running: arr[1] === 'start/running'
	};
}

function isRunning(service) {
	return service.running === true;
}

function byName(a, b) {
	if (a.name > b.name) {
		return 1;
	}
	if (a.name < b.name) {
		return -1;
	}
	return 0;
}

function makeErrorPromise(err){
	var deferred = Q.defer();
	deferred.reject('getServices: Only works on linux');
	return deferred.promise;
}

function getServicesLinux(){
	return exec('initctl list').then(function (response) {
		var items = response.stdout.split('\n');
		return items
			.map(extractInfo)
			.filter(isRunning)
			.sort(byName);

	});
//.fail(function (err) {
//		console.log(err);
//	});
}



