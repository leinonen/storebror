
var app = angular.module('app',[]);

app.controller('AppController', function($http,$interval){

	var vm = this;

	vm.title = 'Storebror';

	vm.clients = [];
	vm.client = {};
	vm.total = { 
		size:{value:0},
		used:{value:0},
		avail:{value:0}
	};
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
			if (vm.total.size.unit === 'G' && vm.total.size.value > 1000.0){
				vm.total.size.unit = 'T';
				vm.total.size.value /= 1000.0;
			}
			if (vm.total.used.unit === 'G' && vm.total.used.value > 1000.0){
				vm.total.used.unit = 'T';
				vm.total.used.value /= 1000.0;
			}
			if (vm.total.avail.unit === 'G' && vm.total.avail.value > 1000.0){
				vm.total.avail.unit = 'T';
				vm.total.avail.value /= 1000.0;
			}
		});

		$http.get('/config').then(function(response){
			vm.title = response.data.name;
		});
	}


	fetchData();

	$interval(fetchData, 10000);


});