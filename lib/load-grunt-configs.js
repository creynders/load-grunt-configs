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
var CSON = require( 'cson-parser' );

module.exports = function( grunt,
                           options ){
    if( !options ){
        options = {};
    } else {
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

    var files = grunt.file.expand( options.config.src );
    var mergeCustomizer = options.config.mergeCustomizer;

    // verbose header (helps locating source of verbose messages)
    if( grunt.option( 'verbose' ) || grunt.option( 'debug' ) ){
        grunt.log.subhead( 'Loading grunt configs via "load-grunt-configs" from ' + files.length + ' file(s).' );
        if( grunt.option( 'debug' ) ){
            grunt.log.writeln( util.inspect( files ) );
        }
    }

    files.forEach( function( filepath ){
        var taskconfig;
        var ext = path.extname( filepath );
        var abspath = path.resolve( filepath );

        // verbose log before loading file (helps troubleshooting bugged files)
        //if( grunt.option( 'verbose' ) ){
            grunt.verbose.write( 'Loading ' + filepath + '...' );
        //}

        switch( ext ){
            case ".yaml":
            case ".yml":
                taskconfig = yaml.safeLoad( fs.readFileSync( abspath, 'utf-8' ) );
                break;
            case ".cson":
                taskconfig = CSON.parse( fs.readFileSync( abspath, 'utf-8' ) );
                break;
            default :
                taskconfig = require( abspath );
                break;
        }

        if( _.isFunction( taskconfig ) ){
            // verbose log before invoking fn() (helps troubleshooting bugged files)
            grunt.verbose.write( 'is fn(), invoking...' );
            taskconfig = taskconfig( grunt, _.clone( options ) );
        }

        if( "undefined" === typeof taskconfig ){
            return grunt.warn( "No valid task configuration found in " + filepath );
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
                        taskname = pair[ 0 ];
                        temp[ taskname ] = {};
                        temp[ taskname ][ pair[ 1 ] ] = value;
                        break;
                    case 1:
                        temp[ key ] = value;
                        break;
                    default:
                        throw new Error( 'Cannot nest more than 2 levels' );
                }
                _.merge( tasks, temp, mergeCustomizer );
            } );
        } else {
            taskname = path.basename( filepath ).replace( path.extname( filepath ), '' );
            tasks[ taskname ] = taskconfig;
        }
        taskconfig = tasks;

        // verbose log of tasks loaded from file
        if( grunt.option( 'verbose' ) ){
            var keys;
            grunt.verbose.ok();
            _.each( taskconfig, function( value,
                                          key ){
                grunt.verbose.write( '+ ' + key );
                keys = _.keys( value );
                if( keys.length ){
                    grunt.verbose.writeln( ': [' + keys.join( ', ' ) + ']' );
                }
            } );
            grunt.verbose.writeln();
        }

        _.merge( options, taskconfig, mergeCustomizer );
    } );

    //for speed reasons we don't use grunt.verbose.writeln
    if( grunt.option( 'debug' ) ){
        grunt.log.writeln( util.inspect( options, {
            depth : null
        } ) );
    }
    return options;
};
