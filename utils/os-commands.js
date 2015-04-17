'use strict';

var os = require('os');
var commands = {

	'list-process': {
		win32: '',
		linux: 'initctl list',
		darwin: ''
	}

};

exports.get = function(name){
	var platform = os.platform();

	return commands[name][platform];
};