var dip = require('./drives');

describe('drives test suite', function () {

	var drives = [
		{size: '2.5T', used: '2.5T', avail: '0M'},
		{size: '500G', used: '599G', avail: '0M'},
		{size: '1.0T', used: '1.1T', avail: '0M'}
	];//     4000G         4199G           0G

	it("should parse units correctly", function () {
		var unit1 = dip.parseUnit('400G');
		expect(unit1.value).toBe(400);
		expect(unit1.unit).toBe('G');

		var unit2 = dip.parseUnit('4.7T');
		expect(unit2.value).toBe(4.7);
		expect(unit2.unit).toBe('T');
	});

});