'use strict';

// The actual grunt server settings
module.exports = {
	options    : {
		port       : '<%= ports.app %>',
		livereload : '<%= ports.livereload %>',
		// Change this to '0.0.0.0' to access the server from outside
		hostname   : 'localhost'
	},
	livereload : {
		options : {
			open : true,
			base : [
				'.tmp', '<%= paths.app %>'
			]
		}
	},
	test       : {
		options : {
			port : '<%= ports.test %>',
			base : [
				'.tmp', 'test', '<%= paths.app %>'
			]
		}
	},
	dist       : {
		options : {
			open       : true,
			base       : '<%= paths.dist %>',
			livereload : false
		}
	}
};