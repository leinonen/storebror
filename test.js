'use strict';

var util = require('./util');
var diskinfo = require('./diskinfo-promise');
var _ = require('lodash');
var exec = require('child-process-promise').exec;


/*
var items = [
	'[ - ]  procps',
	'[ + ]  resolvconf',
	'[ + ]  rpcbind',
	'[ - ]  rsync',
	'[ + ]  rsyslog',
	'[ + ]  samba',
	'[ - ]  samba-ad-dc',
	'[ + ]  smbd',
	'[ - ]  ssh',
	'[ - ]  sudo',
	'[ - ]  tomcat7',
	'[ + ]  transmission-daemon'
];


var res = items.map(function (row) {
	var arr = row.trim().replace(/\s+/g, ' ').split(' ');
	return {
		running: arr[1] === '+',
		name: arr[3]
	};
}).filter(function (service) {
	return service.running === false;
}).forEach(function (service) {
	console.log('service: ' + service.name);
});

*/


var items = [
	'plymouth-ready stop/waiting',
	'plymouth-splash stop/waiting',
	'plymouth-upstart-bridge stop/waiting',
	'portmap-wait stop/waiting',
	'udevmonitor stop/waiting',
	'mountall-bootclean.sh start/running',
	'network-interface-security (network-interface/p132p1) start/running',
	'network-interface-security (network-interface/lo) start/running',
	'network-interface-security (networking) start/running',
	'networking start/running',
	'plexmediaserver start/running, process 911',
	'tty6 start/running, process 1062',
	'dmesg stop/waiting',
	'procps stop/waiting',
	'idmapd start/running, process 3652',
	'console-font stop/waiting',
	'network-interface-container stop/waiting',
	'ureadahead stop/waiting'
];


//exec('initctl list').then(function(response) {
//	var items = response.stdout.split('\n');

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

function byName(a,b){
	if (a.name > b.name) {
		return 1;
	}
	if (a.name < b.name) {
		return -1;
	}
	return 0;
}

var res = items
	.map(extractInfo)
	.filter(isRunning)
	.sort(byName)
	.forEach(function (service) {
		console.log('service: ' + service.name);
	});

//}).fail(function(err){
//	console.log(err);
//});




