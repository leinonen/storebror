
var app = angular.module('app',[]);

app.controller('AppController', function($http){

	var vm = this;

	vm.title = 'Storebror';

	vm.clients = [];

	vm.total = {};

	$http.get('/clients').then(function(response){
		vm.clients = response.data;
	});

	$http.get('/stats').then(function(response){
		vm.total = response.data;
	});

	$http.get('/config').then(function(response){
		vm.title = response.data.name;
	});


});