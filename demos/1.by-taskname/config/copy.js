'use strict';
// Copies remaining files to places other tasks can use

module.exports = {
	dist   : {
		files : [
			{
				expand : true,
				dot    : true,
				cwd    : '<%= paths.app %>',
				dest   : '<%= paths.dist %>',
				src    : [
					'*.{ico,png,txt}', '.htaccess', 'images/{,*/}*.webp', '{,*/}*.html', 'styles/fonts/{,*/}*.*',
					'bower_components/sass-bootstrap/fonts/*.*'
				]
			}
		]
	},
	styles : {
		expand : true,
		dot    : true,
		cwd    : '<%= paths.app %>/styles',
		dest   : '.tmp/styles/',
		src    : '{,*/}*.css'
	}
};