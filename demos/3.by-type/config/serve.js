'use strict';

module.exports.tasks = {
	connect    : {
		livereload : {
			options : {
				open : true,
				base : [
					'.tmp', '<%= paths.app %>'
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
	},
	clean      : {
		server : '.tmp'
	},
	concurrent : {
		server : [
			'compass:server', 'copy:styles'
		]
	},
	watch      : {
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
	},
	compass    : {
		server : {
			options : {
				debugInfo : true
			}
		}
	},
	jshint     : {
		all : [
			'Gruntfile.js', '<%= paths.app %>/scripts/{,*/}*.js', '!<%= paths.app %>/scripts/vendor/*',
			'test/spec/{,*/}*.js'
		]
	}
}