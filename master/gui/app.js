var app = angular.module('app', []);
/*
app.filter('secondsToDays', [function () {
	return function (seconds) {
		var numdays = Math.floor(seconds / 86400);
		var numhours = Math.floor((seconds % 86400) / 3600);
		var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
		return numdays + " days, " + numhours + " hours, " + numminutes + ' minutes';
	};
}]); */

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

	vm.isOld = function(index){
		var now = new Date();
		var reportDate = new Date(vm.clients[index].lastUpdate);
		var hours = Math.abs(now - reportDate) / (60*60*1000);
		return hours > 1.0;
	};

	vm.selectClient = function (idx) {
		vm.selectedClientIndex = idx;
		vm.client = vm.clients[vm.selectedClientIndex];
		vm.services = {
			active: vm.client.services.filter(function (service) {
				return service.running === true;
			}),
			inactive: vm.client.services.filter(function (service) {
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
			vm.total = response.data;
		});

		$http.get('/config').then(function (response) {
			vm.title = response.data.name;
		});
	}


	fetchData();

	$interval(fetchData, 10000);


});