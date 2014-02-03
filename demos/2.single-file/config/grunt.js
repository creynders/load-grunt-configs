'use strict';

module.exports.tasks = {
	// Watches files for changes and runs tasks based on the changed files
	watch           : {
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

	// The actual grunt server settings
	connect         : {
		options    : {
			port       : '<%= ports.app %>',
			livereload : '<%= ports.livereload %>',
			// Change this to '0.0.0.0' to access the server from outside
			hostname   : 'localhost'
		},
		livereload : {
			options : {
				open : true,
				base : [
					'.tmp', '<%= paths.app %>'
				]
			}
		},
		test       : {
			options : {
				port : '<%= ports.test %>',
				base : [
					'.tmp', 'test', '<%= paths.app %>'
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

	// Empties folders to start fresh
	clean           : {
		dist   : {
			files : [
				{
					dot : true,
					src : [
						'.tmp', '<%= paths.dist %>/*', '!<%= paths.dist %>/.git*'
					]
				}
			]
		},
		server : '.tmp'
	},

	// Make sure code styles are up to par and there are no obvious mistakes
	jshint          : {
		options : {
			jshintrc : '.jshintrc',
			reporter : require('jshint-stylish')
		},
		all     : [
			'Gruntfile.js', '<%= paths.app %>/scripts/{,*/}*.js', '!<%= paths.app %>/scripts/vendor/*',
			'test/spec/{,*/}*.js'
		]
	},

	// Mocha testing framework configuration options
	mocha           : {
		all : {
			options : {
				run  : true,
				urls : ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
			}
		}
	},

	// Compiles Sass to CSS and generates necessary files if requested
	compass         : {
		options : {
			sassDir                 : '<%= paths.app %>/styles',
			cssDir                  : '.tmp/styles',
			generatedImagesDir      : '.tmp/images/generated',
			imagesDir               : '<%= paths.app %>/images',
			javascriptsDir          : '<%= paths.app %>/scripts',
			fontsDir                : '<%= paths.app %>/styles/fonts',
			importPath              : '<%= paths.app %>/bower_components',
			httpImagesPath          : '/images',
			httpGeneratedImagesPath : '/images/generated',
			httpFontsPath           : '/styles/fonts',
			relativeAssets          : false,
			assetCacheBuster        : false
		},
		dist    : {
			options : {
				generatedImagesDir : '<%= paths.dist %>/images/generated'
			}
		},
		server  : {
			options : {
				debugInfo : true
			}
		}
	},

	// Add vendor prefixed styles
	autoprefixer    : {
		options : {
			browsers : ['last 1 version']
		},
		dist    : {
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

	// Automatically inject Bower components into the HTML file
	'bower-install' : {
		app : {
			html       : '<%= paths.app %>/index.html',
			ignorePath : '<%= paths.app %>/'
		}
	},

	// Renames files for browser caching purposes
	rev             : {
		dist : {
			files : {
				src : [
					'<%= paths.dist %>/scripts/{,*/}*.js', '<%= paths.dist %>/styles/{,*/}*.css',
					'<%= paths.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
					'<%= paths.dist %>/styles/fonts/{,*/}*.*'
				]
			}
		}
	},

	// Reads HTML for usemin blocks to enable smart builds that automatically
	// concat, minify and revision files. Creates configurations in memory so
	// additional tasks can operate on them
	useminPrepare   : {
		options : {
			dest : '<%= paths.dist %>'
		},
		html    : '<%= paths.app %>/index.html'
	},

	// Performs rewrites based on rev and the useminPrepare configuration
	usemin          : {
		options : {
			assetsDirs : ['<%= paths.dist %>']
		},
		html    : ['<%= paths.dist %>/{,*/}*.html'],
		css     : ['<%= paths.dist %>/styles/{,*/}*.css']
	},

	// The following *-min tasks produce minified files in the dist folder
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
	htmlmin         : {
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

	// By default, your `index.html`'s <!-- Usemin block --> will take care of
	// minification. These next options are pre-configured if you do not wish
	// to use the Usemin blocks.
	// cssmin: {
	//     dist: {
	//         files: {
	//             '<%= paths.dist %>/styles/main.css': [
	//                 '.tmp/styles/{,*/}*.css',
	//                 '<%= paths.app %>/styles/{,*/}*.css'
	//             ]
	//         }
	//     }
	// },
	// uglify: {
	//     dist: {
	//         files: {
	//             '<%= paths.dist %>/scripts/scripts.js': [
	//                 '<%= paths.dist %>/scripts/scripts.js'
	//             ]
	//         }
	//     }
	// },
	// concat: {
	//     dist: {}
	// },

	// Copies remaining files to places other tasks can use
	copy            : {
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

	// Generates a custom Modernizr build that includes only the tests you
	// reference in your app
	modernizr       : {
		devFile    : '<%= paths.app %>/bower_components/modernizr/modernizr.js',
		outputFile : '<%= paths.dist %>/bower_components/modernizr/modernizr.js',
		files      : [
			'<%= paths.dist %>/scripts/{,*/}*.js', '<%= paths.dist %>/styles/{,*/}*.css',
			'!<%= paths.dist %>/scripts/vendor/*'
		],
		uglify     : true
	},

	// Run some tasks in parallel to speed up build process
	concurrent      : {
		server : [
			'compass:server', 'copy:styles'
		],
		test   : [
			'copy:styles'
		],
		dist   : [
			'compass', 'copy:styles', 'imagemin', 'svgmin'
		]
	}
}