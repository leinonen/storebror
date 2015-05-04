(function () {

	'use strict';

	angular.module('app')
		.directive('clientList', function (ClientService) {

			return {
				scope: {},
				templateUrl: 'app/clientList/client_list.html',
				replace: true,
				controller: 'ClientListCtrl',
				controllerAs: 'ctrl'
			};

		});

})();