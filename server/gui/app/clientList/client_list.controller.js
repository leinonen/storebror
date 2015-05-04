(function () {

	'use strict';

	angular.module('app')
		.controller('ClientListCtrl', function ($rootScope, ClientService) {

			var controller = this;
			controller.clients = [];
			controller.selectedClient = undefined;

			ClientService.getClients().then(function (clients) {
				controller.clients = clients;
				controller.selectClient(clients[0]._id);
			});

			controller.selectClient = function (id) {
				controller.selectedClient = id;
				$rootScope.$emit('LoadClient', id);
			}

		});

})();