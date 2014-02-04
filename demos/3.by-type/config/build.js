'use strict';

module.exports.tasks = {
	clean         : {
		dist : {
			files : [
				{
					dot : true,
					src : [
						'.tmp', '<%= paths.dist %>/*', '!<%= paths.dist %>/.git*'
					]
				}
			]
		},
	},
	useminPrepare : {
		options : {
			dest : '<%= paths.dist %>'
		},
		html    : '<%= paths.app %>/index.html'
	},
	concurrent    : {
		dist : [
			'compass:dist', 'copy:styles', 'imagemin', 'svgmin'
		]
	},
	autoprefixer  : {
		dist : {
			files : [
				{
					expand : true,
					cwd    : '.tmp/styles/',
					src    : '{,*/}*.css',
					dest   : '.tmp/styles/'
				}
			]
		}
	},
	copy          : {
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
	},
	modernizr     : {
		devFile    : '<%= paths.app %>/bower_components/modernizr/modernizr.js',
		outputFile : '<%= paths.dist %>/bower_components/modernizr/modernizr.js',
		files      : [
			'<%= paths.dist %>/scripts/{,*/}*.js', '<%= paths.dist %>/styles/{,*/}*.css',
			'!<%= paths.dist %>/scripts/vendor/*'
		],
		uglify     : true
	},
	rev           : {
		dist : {
			files : {
				src : [
					'<%= paths.dist %>/scripts/{,*/}*.js', '<%= paths.dist %>/styles/{,*/}*.css',
					'<%= paths.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}', '<%= paths.dist %>/styles/fonts/{,*/}*.*'
				]
			}
		}
	},
	usemin        : {
		options : {
			assetsDirs : ['<%= paths.dist %>']
		},
		html    : ['<%= paths.dist %>/{,*/}*.html'],
		css     : ['<%= paths.dist %>/styles/{,*/}*.css']
	},
	htmlmin       : {
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
	},
	compass       : {
		dist : {
			options : {
				generatedImagesDir : '<%= paths.dist %>/images/generated'
			}
		},
	},
	imagemin        : {
		dist : {
			files : [
				{
					expand : true,
					cwd    : '<%= paths.app %>/images',
					src    : '{,*/}*.{gif,jpeg,jpg,png}',
					dest   : '<%= paths.dist %>/images'
				}
			]
		}
	},
	svgmin          : {
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
	},
};