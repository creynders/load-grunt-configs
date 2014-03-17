'use strict';

module.exports = function(grunt, options){
    return {
        lib        : {
            files : '<%= config.paths.lib %>',
            tasks :
            [
                'jshint:lib'
            ]
        },
        build      : {
            files : '<%= config.paths.build %>',
            tasks :
            [
                'jshint:build'
            ]
        },
        test       : {
            files : '<%= config.paths.test %>',
            tasks :
            [
                'jshint:test',
                'nodeunit'
            ]
        },
        docs       : {
            files   :
            [
                'README.md'
            ],
            tasks   :
            [
                'clean:tmp',
                'markdown:docs'
            ],
            options : {
                livereload : true
            }
        },
        livereload : {
            options : {
                livereload : '<%= connect.options.livereload %>'
            },
            files   :
            [
                '.tmp/{,*/}*.html'
            ]
        }

    };
};