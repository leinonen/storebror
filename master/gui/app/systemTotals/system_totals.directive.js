(function () {

	'use strict';

	angular.module('app')
		.directive('systemTotals', function (StatsService) {

			return {
				scope: {},
				templateUrl: 'app/systemTotals/system_totals.html',
				replace: true,
				controller: 'SystemTotalsCtrl',
				controllerAs: 'ctrl'
			};

		});

})();