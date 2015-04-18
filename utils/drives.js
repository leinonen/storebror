var exec = require('child-process-promise').exec;
var calculator = require('./unitcalculator');
var _ = require('lodash');

function get() {
	return exec('df -h').then(parseOutput);
}

exports.get = get;


function parseOutput(result) {
	var drives = result.stdout
		.split('\n')
		.filter(noEmptyRows)
		.map(convertRow)
		.filter(isDevDrive)
		.sort(byFilesystem);
	return {
		drives: drives,
		totals: {
			size: calculator.sum(_.pluck(drives, 'size')),
			used: calculator.sum(_.pluck(drives, 'used')),
			avail: calculator.sum(_.pluck(drives, 'avail'))
		}
	}
}

function noEmptyRows(row) {
	return row.length > 0;
}

function convertRow(row) {
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


function parseUnit(str) {
	str = str.replace('i', ''); // OSX
	var unit = str.substr(str.length - 1);
	var value = parseFloat(str.replace(unit, ''));
	return {
		unit: unit,
		value: value
	}
}
exports.parseUnit = parseUnit;


function extractColumns(columns) {
	var result = {
		filesystem: columns[0],
		size: parseUnit(columns[1]),
		used: parseUnit(columns[2]),
		avail: parseUnit(columns[3])
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
