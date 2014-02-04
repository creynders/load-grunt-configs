/*
 * load-grunt-configs
 * https://github.com/creynders/load-grunt-configs
 *
 * Copyright (c) 2014 Camille Reynders
 * Licensed under the MIT license.
 *
 * With special thanks to Thomas Boyt.
 * This module is based on the ideas in his excellent tutorial:
 * http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html
 */

'use strict';

var _ = require('lodash');
var path = require('path');

module.exports = function(grunt, options){

	options = _.merge({
		config: {
			src : ['config/*.js*', 'config/*.coffee']
		}
	}, options);

	grunt.file.expand(options.config.src).forEach(function(filepath){
		var key;
		var taskconfig = require(path.resolve(filepath));

		if(taskconfig.hasOwnProperty('tasks')){
			taskconfig = taskconfig.tasks;
		}else{
			var tasks = {};
			tasks[path.basename(filepath).replace(/\.+(js||json||coffee)$/, '')] = taskconfig;
			taskconfig = tasks;
		}

		if(_.isFunction(taskconfig)){
			taskconfig = taskconfig(grunt, options);
		}

		_.each(taskconfig, function(taskconfig, key){
			var nested = key.split(':');
			var n = nested.length;
			var runner = options;
			_.each(nested, function (key, index){
				if(! runner.hasOwnProperty(key)){
					runner[key] = {};
				}
				if(index>= n-1){
					runner[key] = taskconfig;
				}
				runner = runner[key];
			});
		});

	});
	return options;
};
