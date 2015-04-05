
var app = angular.module('app',[]);

app.controller('AppController', function($http){

	var vm = this;

	vm.title = 'Storebror';

	vm.clients = [];

	$http.get('/clients').then(function(response){
		vm.clients = response.data;
	});

});