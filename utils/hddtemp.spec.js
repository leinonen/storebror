var hddtemp = require('./hddtemp');

describe('test for hddtemp', function () {

	var output = '/dev/sda: WDC WD3200JB-00KFA0: 38°C\n' +
		'/dev/sdb: WDC WD5000AAKS-00TMA0: 39°C\n' +
		'/dev/sdc: SAMSUNG HD753LJ: 31°C\n' +
		'/dev/sdd: WDC WD1002FAEX-00Z3A0: 35°C\n' +
		'/dev/sde: WDC WD3200KS-00PFB0: 39°C\n' +
		'/dev/sdf: WDC WD1001FALS-00E8B0: 37°C\n' +
		'/dev/sdg: WDC WD1001FALS-00J7B0: 37°C\n' +
		'/dev/sdh: WDC WD5000AAKS-22TMA0: 35°C\n' +
		'/dev/sdi: WDC WD20EARX-00PASB0: 34°C\n' +
		'/dev/sdj: SAMSUNG SSD 830 Series: 33°C\n' +
		'/dev/sdk: WDC WD20EARX-00PASB0: 34°C\n' +
		'/dev/sdl: SAMSUNG HM500JI: 32°C\n';

	it('should parse the values', function () {

		var drives = hddtemp.parse(output);

		expect(drives.length).toBe(12);
		expect(drives[0].drive).toBe('/dev/sda');
		expect(drives[0].temp).toBe('38°C');

	});


	it('should try to run hddTemp', function (done) {

		hddtemp.getHddTemp().then(function(temps){
			done();
		}).fail(function(err){
			done();
		});

	});

});