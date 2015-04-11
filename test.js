var util = require('./util');
var diskinfo = require('./diskinfo-promise');
var _ = require('lodash');

diskinfo.get().then(function(drives) {

	console.log(drives);
	/*drives.forEach(function(drive) {
		console.log(drive);
	});*/

}).fail(function(err){
	console.error(err);
});
