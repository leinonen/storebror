/*var drives = require('./utils/drives');

drives
	.get()
	.then(function (drives) {
		console.log(drives);
	})
.fail(function(err){
		console.log(err);
	});*/

var now = new Date('2015-04-19T21:42:50.006Z');
var reportDate = new Date('2015-04-18T20:42:50.006Z');

var hours = Math.abs(now - reportDate) / (60*60*1000);

console.log(hours);