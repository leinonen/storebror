(function () {

	'use strict';

	angular.module('app')
		.service('ClientService', function ($http, $interval) {

			var clientService = this;

			clientService.getClients = function () {
				return $http.get('/clients').then(function (response) {
					return response.data;
				});
			};

			clientService.getClient = function (id) {
				return $http.get('/clients/' + id).then(function (response) {
					return response.data;
				});
			};

      clientService.updateClient = function (id, client) {
        return $http.post('/clients/' + id, client).then(function (response) {
          return response.data;
        });
      };

		});

})();