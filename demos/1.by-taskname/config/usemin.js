'use strict';
// Performs rewrites based on rev and the useminPrepare configuration

module.exports = {
	options : {
		assetsDirs : ['<%= paths.dist %>']
	},
	html    : ['<%= paths.dist %>/{,*/}*.html'],
	css     : ['<%= paths.dist %>/styles/{,*/}*.css']
};