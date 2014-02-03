'use strict';
// Run some tasks in parallel to speed up build process

module.exports = {
	server : [
		'compass:server', 'copy:styles'
	],
	test   : [
		'copy:styles'
	],
	dist   : [
		'compass', 'copy:styles', 'imagemin', 'svgmin'
	]
};