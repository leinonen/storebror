(function () {

	'use strict';

	angular.module('app')
		.directive('clientDetails', function (ClientService) {

			return {
				scope: {},
				templateUrl: 'app/clientDetails/client_details.html',
				replace: true,
				controller: 'ClientDetailsCtrl',
				controllerAs: 'ctrl'
			};

		});

})();