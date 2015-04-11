var util = require('./util');
var diskinfo = require('./diskinfo-promise');
var _ = require('lodash');

/*diskinfo.get().then(function(drives) {

	console.log(drives);

}).fail(function(err){
	console.error(err);
});
*/

var drives = [
{
	size: "3M",
	used: "1M",
	avail: "2M"
}/*,
{
	size: "30G",
	used: "10G",
	avail: "20G"
}*/
];

var sum = diskinfo.driveSummary(drives);
console.log(sum);