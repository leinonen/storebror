var dip = require('./disk-info-promise');

describe('disk-info-promise test suite', function () {

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


	it("should convert units to gigabyte correctly", function () {
		var a = dip.convertUnitToGigabyte(dip.parseUnit('400G'));
		var b = dip.convertUnitToGigabyte(dip.parseUnit('4.7T'));

		expect(a.value).toBe(400);
		expect(a.unit).toBe('G');

		expect(b.value).toBe(4700);
		expect(b.unit).toBe('G');
	});


	it("should display correct gigabyte values when running driveSummary", function () {
		var summary= dip.driveSummary(drives);
		expect(summary.size.value).toEqual(4000);
		expect(summary.size.unit).toBe('G');
		expect(summary.used.value).toEqual(4199);
		expect(summary.used.unit).toBe('G');
		expect(summary.avail.value).toEqual(0);
		expect(summary.avail.unit).toBe('G');
	});


	it("should display correct values when fixing totals", function () {
		var totals = dip.fixTotals(dip.driveSummary(drives));
		expect(totals.size.value).toBe(4.0);
		expect(totals.size.unit).toBe('T');
		expect(totals.used.value).toBe(4.199);
		expect(totals.used.unit).toBe('T');
	});

});