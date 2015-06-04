(function () {

	'use strict';

	angular.module('app').controller('SystemTotalsCtrl', function ($interval, StatsService) {

		var controller = this;

		controller.total = {
			size: {value: 0},
			used: {value: 0},
			avail: {value: 0}
		};

    controller.cpustats = {
      computers: 0,
      totalCores: 0,
      totalGHz: 0
    };

		function getStats() {
			StatsService.getStats().then(function (totals) {
				controller.total = totals;
			});
      StatsService.getCpuInfo().then(function (cpuinfo) {
        controller.cpustats = cpuinfo;
      });
		}

		getStats();

		$interval(getStats, 10 * 1000);

	});

	angular.module('app').directive('systemTotals', function (StatsService) {

		return {
			scope: {},
			templateUrl: 'app/systemTotals/system_totals.html',
			replace: true,
			controller: 'SystemTotalsCtrl',
			controllerAs: 'ctrl'
		};

	});

})();