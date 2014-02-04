# load-grunt-configs [![Build Status](https://secure.travis-ci.org/creynders/load-grunt-configs.png?branch=master)](http://travis-ci.org/creynders/load-grunt-configs)

Loads grunt task configurations from separate files.

Grunt files tend to grow fast due to big amount of tasks and their configuration objects.
This module allows you to split your Grunt task configuration objects into separate files any way you choose.
There are similar modules that allow you to the same, but with `grunt-load-configs` **you can configure targets for a single task in multiple files**.

This means you no longer need to group all task targets into a single file, but can split them up according to their task dependencies. 

For example: you use the `watch` task to recompile your `.scss` files, but also to lint your source `.js` whenever one has changed. Typically you'd add a single `watch` configuration object to configure this, but with `load-grunt-configs` you can split these into several files and group all task targets together whenever it makes sense:

```javascript

//config/css.js

module.exports.tasks={
    watch:{
        scss: {
            files: ['app/sass/*.{scss,sass}'],
            tasks: ['compass:source']
        }
    },
    compass:{
        source:{
            //configuration settings
        }
    }
};

//config/lint.js

module.exports.tasks = {
    watch : {
        lint: {
            files: ['app/{,*/}*.js']
            tasks: ['jshint:source']
        }
    },
    jshint: {
        source: {
            //configuration settings
        }
    }
}
```

## Getting Started
Install the module with: `npm install load-grunt-configs --save-dev`

```javascript
// Gruntfile.js
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');

    var configs = require('load-grunt-configs')(grunt);
    grunt.initConfig(configs);

    grunt.registerTask('default', ['jshint']);
}
```

```json
// config/jshint.json
{
    "options"   : {
        "jshintrc" : ".jshintrc"
    },
    "gruntfile"       : {
        "src" : "Gruntfile.js"
    }
}
```

## Using node modules for configuration

Task configuration is also possible through node modules, either by exposing an object:

```javascript
//config/jshint.js
module.exports = {
     options   : {
         jshintrc : ".jshintrc"
     },
     gruntfile       : {
         src : "Gruntfile.js"
     }
 }
 ```

 Or by exposing a function which returns an object:

```javascript
//config/jshint.js
module.exports = function(grunt, options){
     return {
         options   : {
             jshintrc : ".jshintrc"
         },
         gruntfile       : {
             src : "Gruntfile.js"
         }
     }
 }
```

## Declaring multiple task configurations in one file

If the returned object contains a `tasks` key, its value will be assumed to be a name/configuration pair mapping:

```javascript
//config/grunt.json
{
    "tasks" : {
        "jshint" : {
            "options"   : {
                "jshintrc" : ".jshintrc"
            },
            "gruntfile"       : {
                "src" : "Gruntfile.js"
            }
        },
        "watch" : {
            "gruntfile"       : {
                "src" : "Gruntfile.js",
                "tasks" : ['jshint:gruntfile']
            }
        }
    }
}
```
The above will configure both the `jshint` and `watch` tasks.

## Split multi-task configurations

But wait, there is more!
You can split multi-task configurations in multiple files as well.
For instance if you have the above `config/grunt.json` file and you add the following file:

```javascript
//config/test.json
{
    "tasks": {
        "jshint" : {
            "test": {
                "src": ["test/**/*.js"]
            }
        }
        "watch" : {
            "test" : {
                "src" : ["test/**/*.js"],
                "tasks" : ['jshint:test']
            }
        }
    }
}
```

Now both `watch` and `jshint` tasks have two targets: `gruntfile` and `test`.

## Passing values to the configuration files

If you declare a function in your config file it receives two arguments: `grunt` and `options`, which allows you to use the `grunt` instance and pass values.

```javascript
//Gruntfile.js
var options = {
    paths: {
        jshintrc: '.jshintrc'
    }
};

var configs = require('load-grunt-configs')(grunt, options);

//config/jshint.js
module.exports = function(grunt, options){
     return {
         options   : {
             jshintrc : "<%= options.paths.jshintrc %>"
         },
         gruntfile       : {
             src : "Gruntfile.js"
         }
     };
}
```

## Options

You can modify the directory in which the configuration files need to reside:

```javascript
//Gruntfile.js
var options = {
    config : {
        src: "options/*.js"
    }
};

configs = require('load-grunt-configs')(grunt, options);
```

Will search for the configuration files in an `options` directory.

## Examples

You can take a look at the `Gruntfile.js` and the configuration files in the `config` directory of this project.
Or browse through the 3 demos in this repository:

1. [Configuration per task](https://github.com/creynders/load-grunt-configs/tree/master/demos/1.by-taskname). Each task configuration goes into its own file: `watch.js`, `jshint.js`, `concurrent.js`, ...
1. [A single configs file](https://github.com/creynders/load-grunt-configs/tree/master/demos/2.single-file). The entirety of the grunt configuration is moved to a seperate file (`grunt.js`). This way the Gruntfile.js only contains task declarations.
1. [Configuration by task type](https://github.com/creynders/load-grunt-configs/tree/master/demos/3.by-type). Task target configurationsare spread over multiple files and grouped wherever logically it makes sense. 
E.g. `build.js`, `serve.js`, `test.js`


## License
Copyright (c) 2014 Camille Reynders
Licensed under the MIT license.

With special thanks to @stefanpenner and @thomasboyt.
This module is based on the ideas in Thomas' excellent tutorial:
http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html
