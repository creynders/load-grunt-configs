'use strict';

// Empties folders to start fresh
module.exports = {
	dist   : {
		files : [
			{
				dot : true,
				src : [
					'.tmp', '<%= paths.dist %>/*', '!<%= paths.dist %>/.git*'
				]
			}
		]
	},
	server : '.tmp'
};