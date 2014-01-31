module.exports.tasks = {
	watch : function(grunt, options){
		return {
			lib   : {
				files : '<%= paths.lib %>',
				tasks : ['jshint:lib']
			},
			build : {
				files : '<%= paths.build %>',
				tasks : ['jshint:build']
			}
		};
	}
};