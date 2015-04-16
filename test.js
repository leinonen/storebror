'use strict';

var util = require('./util');
var diskinfo = require('./diskinfo-promise');
var _ = require('lodash');
var exec   = require('child-process-promise').exec;

/*
diskinfo.get().then(function(drives) {

	console.log(drives);

}).fail(function(err){
	console.error(err);
});

*/

exec('service --status-all').then(function(response) {
	console.log(response);
	var output = response.stdout;
	console.log(output);
}).fail(function(err){
	console.log(err);
});



//var sum = diskinfo.driveSummary(drives);
//console.log(sum);
/*
var totals = _.pluck(_.pluck(clients, 'diskinfo'), 'totals')
		.reduceRight(diskinfo.sum);

console.log(totals); */