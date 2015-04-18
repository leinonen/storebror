var calculator = require('./unitcalculator');
var _ = require('lodash');

describe('unitcalculator test suite', function () {

	var drives = [
		{size: {value: 2.5, unit: 'T'}, used: {value: 2.5, unit: 'T'}, avail: {value: 0, unit: 'M'}},
		{size: {value: 500, unit: 'G'}, used: {value: 599, unit: 'G'}, avail: {value: 0, unit: 'M'}},
		{size: {value: 1.0, unit: 'T'}, used: {value: 1.1, init: 'T'}, avail: {value: 0, unit: 'M'}}
	];//            4000G                          4199G                          0G

	it("should sum values correctly", function () {

		var sizeSum = calculator.sum(_.pluck(drives, 'size'));
		expect(sizeSum.value).toBe(4.0);
		expect(sizeSum.unit).toBe('T');

	});

});