'use strict';
//produce minified html in the dist folder
module.exports = {
	dist : {
		options : {
			collapseBooleanAttributes : true,
			collapseWhitespace        : true,
			removeAttributeQuotes     : true,
			removeCommentsFromCDATA   : true,
			removeEmptyAttributes     : true,
			removeOptionalTags        : true,
			removeRedundantAttributes : true,
			useShortDoctype           : true
		},
		files   : [
			{
				expand : true,
				cwd    : '<%= paths.dist %>',
				src    : '{,*/}*.html',
				dest   : '<%= paths.dist %>'
			}
		]
	}
};