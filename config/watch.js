module.exports.tasks = function(grunt, options){
	return {
		"watch:lib"   : {
			files : '<%= paths.lib %>',
			tasks : ['jshint:lib']
		},
		"watch:build" : {
			files : '<%= paths.build %>',
			tasks : ['jshint:build']
		}
	};
};