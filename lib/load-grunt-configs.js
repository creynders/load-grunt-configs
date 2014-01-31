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
			src : 'config/*.js*'
		}
	}, options);

	grunt.file.expand(options.config.src).forEach(function(filepath){
		var key,
			tasks;
		var raw = require(path.resolve(filepath));

		if(raw.hasOwnProperty('tasks')){
			tasks = raw.tasks;
		}else{
			tasks = {};
			tasks[path.basename(filepath).replace(/\.+(js||json)$/, '')] = raw;
		}

		_.each(tasks, function(taskconfig, key){
			if(_.isFunction(taskconfig)){
				taskconfig = taskconfig(grunt, options);
			}
			if(options.hasOwnProperty(key)){
				taskconfig = _.merge(options[key], taskconfig);
			}
			options[key] = taskconfig;
		});

	});

	return options;
};
