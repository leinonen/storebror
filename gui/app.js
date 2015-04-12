
var app = angular.module('app',[]);

app.controller('AppController', function($http,$interval){

	var vm = this;

	vm.title = 'Storebror';

	vm.clients = [];
	vm.client = {};
	vm.total = {};
	vm.selectedClientIndex = 0;

	vm.selectClient = function(idx) {
		vm.selectedClientIndex = idx;
		vm.client = vm.clients[vm.selectedClientIndex];
	};

	function fetchData() {
		$http.get('/clients').then(function(response) {
			vm.clients = response.data;
			vm.client = vm.clients[vm.selectedClientIndex];
		});

		$http.get('/stats').then(function(response){
			vm.total = response.data;
		});

		$http.get('/config').then(function(response){
			vm.title = response.data.name;
		});
	}


	fetchData();

	$interval(fetchData, 10000);


});