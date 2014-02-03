'use strict';

// Watches files for changes and runs tasks based on the changed files
module.exports = {
	js         : {
		files   : ['<%= paths.app %>/scripts/{,*/}*.js'],
		tasks   : ['jshint'],
		options : {
			livereload : true
		}
	},
	jstest     : {
		files : ['test/spec/{,*/}*.js'],
		tasks : ['test:watch']
	},
	gruntfile  : {
		files : ['Gruntfile.js']
	},
	compass    : {
		files : ['<%= paths.app %>/styles/{,*/}*.{scss,sass}'],
		tasks : ['compass:server', 'autoprefixer']
	},
	styles     : {
		files : ['<%= paths.app %>/styles/{,*/}*.css'],
		tasks : ['newer:copy:styles', 'autoprefixer']
	},
	livereload : {
		options : {
			livereload : '<%= connect.options.livereload %>'
		},
		files   : [
			'<%= paths.app %>/{,*/}*.html', '.tmp/styles/{,*/}*.css',
			'<%= paths.app %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
		]
	}
};
