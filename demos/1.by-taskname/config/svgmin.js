'use strict';
//produce minified svg's in the dist folder
module.exports = {
	dist : {
		files : [
			{
				expand : true,
				cwd    : '<%= paths.app %>/images',
				src    : '{,*/}*.svg',
				dest   : '<%= paths.dist %>/images'
			}
		]
	}
};