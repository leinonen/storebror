var util = require('./util');

util.diskinfo().then(function(drives) {

	drives.forEach(function(drive) {
		console.log(drive);
	});

});

