'use strict';

module.exports= function(grunt, options){
	return {
		tasks:{
			"watch:lib"   : {
				files : '<%= paths.lib %>',
				tasks : ['jshint:lib']
			},
			"watch:build" : {
				files : '<%= paths.build %>',
				tasks : ['jshint:build']
			},
			"watch:test" :{
				files : '<%= paths.test %>',
				tasks : ['jshint:test', 'nodeunit']
			}
		}
	};
};