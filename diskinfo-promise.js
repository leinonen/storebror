var exec   = require('child-process-promise').exec;
var _      = require('lodash');


function get() {
	return exec('df -h').then(parseOutput);
}

exports.get = get;

/**
 * Parse the output from stdout.
 */
function parseOutput(result) {
	var drives = [];
	result.stdout.split('\n').forEach(function(row) {
		var columns = row.trim().replace(/\s+/g, ' ').split(' ');
		drives.push(getDriveData(columns));
	});
	//filter out relevant drive details
	var filtered = drives.filter(function(drive) {
		return drive.filesystem.indexOf('/dev') === 0;
	});
	return {
		drives: filtered,
		totals: driveSummary(filtered)
	}
}

// Convert "522G" -> {unit: 'G', value: 522}
// Also convert terrabyte to gigabyte to make summary calculations easier
function parseUnit(str){
	str = str.replace('i',''); // OSX..
	var unit = str.substr(str.length - 1);
	var value = parseFloat( str.replace(unit, '') );
	if (unit === 'T') {
		unit = 'G';
		value *= 1000;
	}
	return {
		unit: unit,
		value: value
	}
}


function driveSummary(drives){
	return _(drives)
	.map(function(x){
		return {
			size: parseUnit(x.size),
			used: parseUnit(x.used),
			avail: parseUnit(x.avail)
		}
	})
	.reduceRight(function(a,b){
		return {
			size: {
				value: a.size.value + b.size.value,
				unit: a.size.unit
			},
			used: {
				value: a.used.value + b.used.value,
				unit: a.used.unit
			},
			avail: {
				value: a.avail.value + b.avail.value,
				unit: a.avail.unit
			}
		};
	});
}


function getDriveData(columns) {
	var result = {
		filesystem: columns[0],
		size:  columns[1],
		used:  columns[2],
		avail: columns[3]
	};
	if (columns.length <= 7) {
		// Linux
		result.mounted = columns[5];
	} else if (columns.length <= 10) {
		// OSX
		result.mounted = columns[8];
	}
	return result;
}
