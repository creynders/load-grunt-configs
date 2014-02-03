'use strict';

// Compiles Sass to CSS and generates necessary files if requested
module.exports = {
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
};