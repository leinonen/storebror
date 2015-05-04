(function () {

	'use strict';

	angular.module('app')
		.controller('ClientDetailsCtrl', function ($rootScope, ClientService) {

			var controller = this;
			controller.client = {};
			controller.services = {};

			$rootScope.$on('LoadClient', function (event, id) {

				ClientService.getClient(id).then(function (client) {
					controller.client = client;
					controller.services = {
						active: controller.client.services.filter(function (service) {
							return service.running === true;
						}),
						inactive: controller.client.services.filter(function (service) {
							return service.running === false;
						})
					}
				})
			});


			controller.showServices = false;
			controller.showFilesystems = false;

			controller.toggleServices = function () {
				controller.showServices = !controller.showServices;
			};

			controller.toggleFilesystems = function () {
				controller.showFilesystems = !controller.showFilesystems;
			};

		});

})();