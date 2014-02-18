'use strict';

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);

	var configs = {
		paths : {
			"lib"   : ["lib/*.js"],
			"build" : ["<%= config.src %>", "package.json", "Gruntfile.js"],
			"test"	: ["test/**/*.js"]
		}
	};

	var loadConfigs = require('./lib/load-grunt-configs');

	configs = loadConfigs(grunt, configs);

	// Project configuration.
	grunt.initConfig(configs);

	// Default task.
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('vigilant', ['watch']);

    grunt.registerTask('preview',
    [
        'clean:tmp',
        'markdown:docs',
        'connect:livereload',
        'watch'
    ]);

};
