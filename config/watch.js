module.exports.tasks = function(grunt, options){
	return {
		watch : {
			lib   : {
				files : '<%= paths.lib %>',
				tasks : ['jshint:lib']
			},
			build : {
				files : '<%= paths.build %>',
				tasks : ['jshint:build']
			}
		}
	};
};