'use strict';

module.exports.tasks = {
	concurrent : {
		test : [
			'copy:styles'
		],
	},
	connect    : {
		test : {
			options : {
				port : '<%= ports.test %>',
				base : [
					'.tmp', 'test', '<%= paths.app %>'
				]
			}
		},
	},
	mocha      : {
		all : {
			options : {
				run  : true,
				urls : ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
			}
		}
	},
};