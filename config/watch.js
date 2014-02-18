'use strict';

module.exports = function(grunt, options){
    return {
        lib        : {
            files : '<%= paths.lib %>',
            tasks :
            [
                'jshint:lib'
            ]
        },
        build      : {
            files : '<%= paths.build %>',
            tasks :
            [
                'jshint:build'
            ]
        },
        test       : {
            files : '<%= paths.test %>',
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