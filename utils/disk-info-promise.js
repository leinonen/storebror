var exec = require('child-process-promise').exec;
var _ = require('lodash');


var conversionFactor = 1000;

exports.conversionFactor = conversionFactor;


function get() {
	return exec('df -h').then(parseOutput);
}

exports.get = get;


function parseOutput(result) {
	var drives = result.stdout.split('\n')
		.map(makeDriveFromRow)
		.filter(isDevDrive)
		.sort(byFilesystem);

	return {
		drives: drives,
		totals: fixTotals(driveSummary(drives))
	}
}


function makeDriveFromRow(row) {
	var columns = row.trim().replace(/\s+/g, ' ').split(' ');
	return extractColumns(columns);
}

var isDevDrive = function (drive) {
	return drive.filesystem.indexOf('/dev') === 0;
};

function byFilesystem(a, b) {
	if (a.filesystem > b.filesystem) {
		return 1;
	}
	if (a.filesystem < b.filesystem) {
		return -1;
	}
	return 0;
}

var zeroTotals = {
	size: {value: 0, unit: 'G'},
	used: {value: 0, unit: 'G'},
	avail: {value: 0, unit: 'G'}
};


function sum(a, b) {
	return {
		size: {value: a.size.value + b.size.value, unit: a.size.unit},
		used: {value: a.used.value + b.used.value, unit: a.used.unit},
		avail: {value: a.avail.value + b.avail.value, unit: a.avail.unit}
	};
}

exports.sum = sum;


/**
 * Convert result from driveSummary to terrabyte if nessecary.
 * @param result
 * @returns {*}
 */
function fixTotals(result) {
	result.size = toTerraByte(result.size);
	result.used = toTerraByte(result.used);
	result.used = toTerraByte(result.used);
	return result;
}

exports.fixTotals = fixTotals;


/**
 * Display drive summary with all values in gigabyte.
 * @param drives
 * @returns {*}
 */
function driveSummary(drives) {
	return _(drives)
		.map(function (x) {
			return {
				size: convertUnitToGigabyte(parseUnit(x.size)),
				used: convertUnitToGigabyte(parseUnit(x.used)),
				avail: convertUnitToGigabyte(parseUnit(x.avail))
			}
		})
		.reduce(sum, zeroTotals);
}

exports.driveSummary = driveSummary;


/**
 * Parse string representation to an object we can work on later.
 * Example: '400G' -> {value: 400, unit:'G'}
 * @param str
 * @returns {{unit: string, value: Number}}
 */
function parseUnit(str) {
	str = str.replace('i', ''); // OSX..
	var unit = str.substr(str.length - 1);
	var value = parseFloat(str.replace(unit, ''));
	return {
		unit: unit,
		value: value
	}
}
exports.parseUnit = parseUnit;


/**
 * Convert unit to gigabyte so we can sum all values later.
 * @param item
 * @returns {*}
 */
function convertUnitToGigabyte(item){
	if (item.unit === 'M'){
		// convert from megabyte to gigabyte
		item.unit = 'G';
		item.value = item.value / conversionFactor;
	} else if (item.unit === 'T') {
		// convert from terrabyte to gigabyte
		// 0.7T -> 700G
		item.unit = 'G';
		item.value = item.value * conversionFactor;
	}
	return item;
}

exports.convertUnitToGigabyte = convertUnitToGigabyte;


function toTerraByte(item) {
	if (item.unit === 'G' && item.value >= conversionFactor) {
		item.unit = 'T';
		item.value /= conversionFactor;
	}
	return item;
}

/**
 * Extract columns from a space separated string, representing a filesystem row.
 * @param columns
 * @returns {{filesystem: *, size: *, used: *, avail: *}}
 */
function extractColumns(columns) {
	var result = {
		filesystem: columns[0],
		size: columns[1],
		used: columns[2],
		avail: columns[3]
	};
	// TODO: use os.platform() here instead?
	if (columns.length <= 7) {
		// Linux
		result.mounted = columns[5];
	} else if (columns.length <= 10) {
		// OSX
		result.mounted = columns[8];
	}
	return result;
}
