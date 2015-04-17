var app = angular.module('app', []);

app.filter('secondsToDays', [function () {
	return function (seconds) {
		var numdays = Math.floor(seconds / 86400);
		var numhours = Math.floor((seconds % 86400) / 3600);
		var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
		return numdays + " days, " + numhours + " hours, " + numminutes + ' minutes';
	};
}]);

app.controller('AppController', function ($http, $interval) {

	var vm = this;

	vm.title = 'Storebror';

	vm.clients = [];
	vm.client = {};

	vm.services = {};

	vm.total = {
		size: {value: 0},
		used: {value: 0},
		avail: {value: 0}
	};
	vm.selectedClientIndex = 0;

	vm.showServices = false;
	vm.showFilesystems = false;

	vm.toggleServices = function () {
		vm.showServices = !vm.showServices;
	};

	vm.toggleFilesystems = function () {
		vm.showFilesystems = !vm.showFilesystems;
	};

	vm.selectClient = function (idx) {
		vm.selectedClientIndex = idx;
		vm.client = vm.clients[vm.selectedClientIndex];
		vm.services = {
			active: vm.client.data.services.filter(function (service) {
				return service.running === true;
			}),
			inactive: vm.client.data.services.filter(function (service) {
				return service.running === false;
			})
		}
	};

	function fetchData() {
		$http.get('/clients').then(function (response) {
			vm.clients = response.data;
			vm.client = vm.clients[vm.selectedClientIndex];
		});

		$http.get('/stats').then(function (response) {
			var factor = 1024.0;
			vm.total = response.data;
			if (vm.total.size.unit === 'G' && vm.total.size.value > factor) {
				vm.total.size.unit = 'T';
				vm.total.size.value /= factor;
			}
			if (vm.total.used.unit === 'G' && vm.total.used.value > factor) {
				vm.total.used.unit = 'T';
				vm.total.used.value /= factor;
			}
			if (vm.total.avail.unit === 'G' && vm.total.avail.value > factor) {
				vm.total.avail.unit = 'T';
				vm.total.avail.value /= factor;
			}
		});

		$http.get('/config').then(function (response) {
			vm.title = response.data.name;
		});
	}


	fetchData();

	$interval(fetchData, 10000);


});