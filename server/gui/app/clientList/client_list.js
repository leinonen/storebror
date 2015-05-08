(function () {

	'use strict';

	angular.module('app').controller('ClientListCtrl', function ($interval, $rootScope, ClientService) {

		var controller = this;
		controller.clients = [];
		controller.selectedClient = undefined;

		function getClients() {
			ClientService.getClients().then(function (clients) {
				controller.clients = clients;
			});
		}

		ClientService.getClients().then(function (clients) {
			controller.clients = clients;
			controller.selectClient(clients[0]._id);
		});

		$interval(getClients, 10 * 1000);

		controller.selectClient = function (id) {
			controller.selectedClient = id;
			$rootScope.$emit('LoadClient', id);
		}

	});

	angular.module('app').directive('clientList', function (ClientService) {

		return {
			scope: {},
			templateUrl: 'app/clientList/client_list.html',
			replace: true,
			controller: 'ClientListCtrl',
			controllerAs: 'ctrl'
		};

	});

})();