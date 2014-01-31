# load-grunt-configs [![Build Status](https://secure.travis-ci.org/creynders/load-grunt-configs.png?branch=master)](http://travis-ci.org/creynders/load-grunt-configs)

Loads grunt task configurations from separate files.

Grunt files tend to grow fast due to big amount of tasks and their configuration objects.
This module allows you to split your Grunt task configuration objects into separate files any way you choose.
I.e. you can even configure targets for a single task in multiple files.

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
     "options"   : {
         "jshintrc" : ".jshintrc"
     },
     "gruntfile"       : {
         "src" : "Gruntfile.js"
     }
 }
 ```

 Or by exposing a function which returns an object:

```javascript
//config/jshint.js
module.exports = function(grunt, options){
     return {
         "options"   : {
             "jshintrc" : ".jshintrc"
         },
         "gruntfile"       : {
             "src" : "Gruntfile.js"
         }
     }
 }
```

## Declaring multiple task configurations in one file

If the returned object contains a `tasks` key, its value will be assumed to be a name/configuration pair mapping:

```javascript
//config/grunt.json
{
    tasks : {
        jshint : {
            "options"   : {
                "jshintrc" : ".jshintrc"
            },
            "gruntfile"       : {
                "src" : "Gruntfile.js"
            }
        },
        watch : {
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
    tasks: {
        jshint : {
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
         "options"   : {
             "jshintrc" : "<%= options.paths.jshintrc %>"
         },
         "gruntfile"       : {
             "src" : "Gruntfile.js"
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

## License
Copyright (c) 2014 Camille Reynders
Licensed under the MIT license.

With special thanks to @stefanpenner and @thomasboyt.
This module is based on the ideas in Thomas' excellent tutorial:
http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html
