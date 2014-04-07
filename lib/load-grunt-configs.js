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

var _ = require( 'lodash' );
var path = require( 'path' );
var yaml = require( 'js-yaml' );
var fs = require( 'fs' );
var util = require( 'util' );
var CSON = require( 'cson' );

module.exports = function( grunt,
                           options ){
    if( !options ){
        options = {};
    }else{
        options = _.clone( options );
    }

    if( !options.config ){
        options.config = {};
    }

    options.config = _.defaults( options.config, {
        src : [
            'config/*.js*',
            'config/*.coffee',
            'config/*.y*ml',
            'config/*.cson'
        ]
    } );

    grunt.file.expand( options.config.src ).forEach( function( filepath ){
        var taskconfig;
        var ext = path.extname( filepath );
        var abspath = path.resolve( filepath );

        switch( ext ){
            case ".yaml":
            case ".yml":
                taskconfig = yaml.safeLoad( fs.readFileSync( abspath, 'utf-8' ) );
                break;
            case ".cson":
                taskconfig = CSON.parseFileSync( abspath );
                break;
            default :
                taskconfig = require( abspath );
                break;
        }

        if( _.isFunction( taskconfig ) ){
            taskconfig = taskconfig( grunt, _.clone( options ) );
        }

        var tasks = {};
        var taskname;
        if( taskconfig.hasOwnProperty( 'tasks' ) ){
            _.each( taskconfig.tasks, function( value,
                                                key ){
                var pair = key.split( ':' );
                var temp = {};
                switch( pair.length ){
                    case 2:
                        taskname = pair[0];
                        temp[taskname] = {};
                        temp[taskname][pair[1]] = value;
                        break;
                    case 1:
                        temp[key] = value;
                        break;
                    default:
                        throw new Error( 'Cannot nest more than 2 levels' );
                        break;
                }
                _.merge( tasks, temp );
            } );
        }else{
            taskname = path.basename( filepath ).replace( path.extname( filepath ), '' );
            tasks[taskname] = taskconfig;
        }
        taskconfig = tasks;
        _.merge( options, taskconfig );
    } );

    //for speed reasons we don't use grunt.verbose.writeln
    if( grunt.option( 'verbose' ) ){
        grunt.log.writeln( util.inspect( options, {
            depth : null
        } ) );
    }
    return options;
};
