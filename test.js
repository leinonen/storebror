var util = require('./util');
var _ = require('lodash');

util.diskinfo().then(function(drives) {

	console.log(drives);
	/*drives.forEach(function(drive) {
		console.log(drive);
	});*/

}).fail(function(err){
	console.error(err);
});
