(function () {

	'use strict';

	angular.module('app')
		.controller('SystemTotalsCtrl', function (StatsService) {

			var controller = this;

			controller.total = {
				size: {value: 0},
				used: {value: 0},
				avail: {value: 0}
			};

			StatsService.getStats().then(function (totals) {
				controller.total = totals;
			});

		});

})();