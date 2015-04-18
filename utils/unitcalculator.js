var conversionFactor = 1000;
var zeroG = {value: 0, unit: 'G'};

function sum(items) {
	return toTerra(items.map(toGigabyte).reduce(add, zeroG));
}
exports.sum = sum;


function toGigabyte(item) {
	if (item.unit === 'M') {
		// convert from megabyte to gigabyte
		return {
			unit: 'G',
			value: item.value / conversionFactor
		};
	} else if (item.unit === 'T') {
		// convert from terrabyte to gigabyte. 0.7T -> 700G
		return {
			unit: 'G', value: item.value * conversionFactor
		};
	} else {
		return item;
	}
}


function toTerra(item) {
	if (item.unit === 'G' && item.value >= conversionFactor) {
		item.unit = 'T';
		item.value = item.value / conversionFactor;
	}
	return item;
}


function add(a, b) {
	//console.log('adding ' + a.value + a.unit + ' and ' + b.value + b.unit);
	if (a.unit !== b.unit){
		throw new Error('Apples and bananas!');
	}
	return {value: a.value + b.value, unit: a.unit};
}

