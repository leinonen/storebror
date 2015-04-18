var drives = require('./utils/drives');

drives
	.get()
	.then(function (drives) {
		console.log(drives);
	})
.fail(function(err){
		console.log(err);
	});