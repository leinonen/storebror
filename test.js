var util = require('./util');
var diskinfo = require('./diskinfo-promise');
var _ = require('lodash');

diskinfo.get().then(function(drives) {

	console.log(drives);

}).fail(function(err){
	console.error(err);
});


//var sum = diskinfo.driveSummary(drives);
//console.log(sum);
/*
var totals = _.pluck(_.pluck(clients, 'diskinfo'), 'totals')
		.reduceRight(diskinfo.sum);

console.log(totals); */