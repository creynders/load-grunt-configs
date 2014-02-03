'use strict';
// Generates a custom Modernizr build that includes only the tests you
// reference in your app

module.exports = {
	devFile    : '<%= paths.app %>/bower_components/modernizr/modernizr.js',
	outputFile : '<%= paths.dist %>/bower_components/modernizr/modernizr.js',
	files      : [
		'<%= paths.dist %>/scripts/{,*/}*.js', '<%= paths.dist %>/styles/{,*/}*.css',
		'!<%= paths.dist %>/scripts/vendor/*'
	],
	uglify     : true
};