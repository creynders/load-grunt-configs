'use strict';

module.exports.tasks = {
	autoprefixer : {
		options : {
			browsers : ['last 1 version']
		},
	},
	connect      : {
		options : {
			port       : '<%= ports.app %>',
			livereload : '<%= ports.livereload %>',
			// Change this to '0.0.0.0' to access the server from outside
			hostname   : 'localhost'
		},
	},
	jshint          : {
		options : {
			jshintrc : '.jshintrc',
			reporter : require('jshint-stylish')
		},
	},
	compass : {
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
	}
}