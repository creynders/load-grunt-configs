'use strict';
// Automatically inject Bower components into the HTML file
module.exports = {
	app : {
		html       : '<%= paths.app %>/index.html',
		ignorePath : '<%= paths.app %>/'
	}
};