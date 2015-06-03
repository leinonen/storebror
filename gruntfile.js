'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		nodemon: {
			dev: {
				script: 'server/server.js',
				options: {
					env: {
						PORT: '8080'
					}
				}
			}
		}

	});

	grunt.registerTask('default', ['nodemon']);
};