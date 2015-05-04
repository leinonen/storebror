(function () {

	'use strict';

	angular.module('app')
		.service('StatsService', function ($http, $interval) {

			var statsService = this;

			statsService.getStats = function () {
				return $http.get('/stats').then(function (response) {
					return response.data;
				});
			};

		});

})();