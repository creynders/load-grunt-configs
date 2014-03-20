# load-grunt-configs [![GitHub version](https://badge.fury.io/gh/creynders%2Fload-grunt-configs.png)](http://badge.fury.io/gh/creynders%2Fload-grunt-configs)[![Build Status](https://secure.travis-ci.org/creynders/load-grunt-configs.png?branch=master)](http://travis-ci.org/creynders/load-grunt-configs)

> Loads grunt task configurations from separate files.

Grunt files tend to grow fast due to big amount of tasks and their configuration objects.
**This module allows you to split your Grunt task configuration objects into separate files any way you choose.**
There are similar modules that allow you to the same, but with `grunt-load-configs` **you can configure targets for a single task in multiple files**.

This means you no longer need to group all task targets into a single file, but can split them up according to their task dependencies.

#### Example

you use the `watch` task to recompile your `.scss` files, but also to lint your source `.js` whenever one has changed. Typically you'd add a single `watch` configuration object to configure this, but with `load-grunt-configs` you can split these into several files and group all task targets together whenever it makes sense:

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

`load-grunt-configs` supports the loading of grunt config files in following formats:

* **json**
* **js** modules
* **coffee** modules
* **cson**
* **yaml**

Though the provided examples are mainly for `json` files and `js` modules, the same applies to the other formats.
You can find examples of all formats in the [`config`][config] directory of this project.

### Migrating your configuration from a big, fat grunt file

I wrote a small utility Grunt task which takes your full-blown Grunt configuration and automatically splits it into separate files: [grunt-generate-configs][grunt-generate-configs] (supports all formats `load-grunt-configs` does too)

**You only need to do this once**:

```shell
npm install grunt-generate-configs
grunt generate-configs
```

This will create a separate `.json` file for each task inside a `config` directory. (See [grunt-generate-configs][grunt-generate-configs] for all options: a different format, directory, etc.)

Next you need to delete the full configuration object in your `Gruntfile.js`.

Then ...

### Automatically loading the config files

Install the _load-grunt-configs_ module with: `npm install load-grunt-configs --save-dev`

```javascript
// Gruntfile.js
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //loads the various task configuration files
    var configs = require('load-grunt-configs')(grunt);
    grunt.initConfig(configs);

    grunt.registerTask('default', ['jshint']);
}
```

`load-grunt-configs` supports the loading of config files as `.js`, `.json`, `.yaml` or `.coffee`. You can even mix and match if you want. Take a look at the [`config`][config] folder of this project to see examples for all formats.

To configure the `jshint` task for example, add a file `config/jshint.json` (in case you didn't use the generator to automatically generate it):

```json
{
    "gruntfile"       : {
        "src" : "Gruntfile.js"
    }
}
```

By default the basename (without the file extension) of the filename will be used to recognize which task is being configured. `jshint` in the above example.

## Advanced usage

### Using node modules for configuration

Task configuration is also possible through node modules, either by exposing an object:

```javascript
//config/jshint.js
module.exports = {
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
         gruntfile       : {
             src : "Gruntfile.js"
         }
     }
 }
```

### Declaring multiple task configurations in one file

If the returned object contains a `tasks` key, its value will be assumed to be a name/configuration pair mapping:

```javascript
//config/grunt.json
{
    "tasks" : {
        "jshint" : {
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

### Split multi-task configurations

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

### Passing values to the configuration files

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
         gruntfile       : {
             src : "Gruntfile.js"
         }
     };
}
```

### Task name prefixed task targets

As a convenience method you can prefix your task targets with the task name, separated by a ":" (colon). This allows you to do this:

```javascript
//config/monitor.js
module.exports.tasks = {
    "watch:test" : {
        src : ["test/**/*.js"],
        tasks : ['jshint:test']
    },
    "watch:gruntfile"       : {
        src : "Gruntfile.js",
        tasks : ['jshint:gruntfile']
    }
}

```

This makes it easier when in the future you'd like to move the `watch:gruntfile` task configuration to another file for instance.

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
1. [Various formats][config]: See the `config` directory of this project.

## All various possibilities

* **json with a single task configuration**: E.g. configures `jshint` task in `config/jshint.json` (task name extracted from file name)

```json
{
    "gruntfile"       : {
        "src" : "Gruntfile.js"
    }
}
```

* **json with multiple task configurations**: E.g. configures `jshint` and `watch` tasks in `config/<whatever makes sense to you>.json`. Note the top-most key "tasks" here, it alerts the module not to extract the task name from the file name.

```json
{
    "tasks" : {
        "jshint" : {
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

* **json with multiple task configurations using task prefixed targets**: E.g. configures `jshint` and `watch` tasks in `config/<whatever makes sense to you>.json`

```json
{
    "tasks" : {
        "jshint:gruntfile"       : {
            "src" : "Gruntfile.js"
        },
        "watch:gruntfile"       : {
            "src" : "Gruntfile.js",
            "tasks" : ['jshint:gruntfile']
        }
    }
}
```

* **js with single task configuration as an object**: E.g. configures `jshint` task in `config/jshint.js`

```javascript
module.exports = {
     gruntfile       : {
         src : "Gruntfile.js"
     }
};
```

* **js with single task configuration as a function**: E.g. configures `jshint` task in `config/jshint.js`

```javascript
module.exports = function(grunt, options){
    return {
        gruntfile       : {
            src : "Gruntfile.js"
        }
    };
};
```

* **js with multiple task configurations as an object**: E.g. configures `jshint` and `watch` task in `config/<whatever makes sense to you>.js`

```javascript
module.exports.tasks = { //note the `tasks` export here [!]
    jshint: {
        gruntfile       : {
            src : "Gruntfile.js"
        }
    },
    watch : {
        gruntfile       : {
            src : "Gruntfile.js",
            tasks : ['jshint:gruntfile']
        }
    }

};
```

* **js with multiple task configurations as a function**: E.g. configures `jshint` and `watch` task in `config/<whatever makes sense to you>.js`

```javascript
module.exports = function(grunt, options) {
    return {
        tasks:{
            jshint: {
                gruntfile       : {
                    src : "Gruntfile.js"
                }
            },
            watch : {
                gruntfile       : {
                    src : "Gruntfile.js",
                    tasks : ['jshint:gruntfile']
                }
            }
        }
    };
};
```

* **js with multiple task configurations as an object using task prefixed targets**: E.g. configures `jshint` and `watch` task in `config/<whatever makes sense to you>.js`

```javascript
module.exports.tasks = { //note the `tasks` export here [!]
    "jshint:gruntfile"       : {
        src : "Gruntfile.js"
    },
    "watch:gruntfile"       : {
            src : "Gruntfile.js",
            tasks : ['jshint:gruntfile']
    }
};
```

* **js with multiple task configurations as a function using task prefixed targets**: E.g. configures `jshint` and `watch` task in `config/<whatever makes sense to you>.js`

```javascript
module.exports = function(grunt, options) {
    return {
        tasks:{
            "jshint:gruntfile"       : {
                src : "Gruntfile.js"
            },
            "watch:gruntfile"       : {
                src : "Gruntfile.js",
                tasks : ['jshint:gruntfile']
            }
        }
    };
};
```

## Changelog

#### v0.3.3

* Add cson support
* Loads yaml files with safeLoad

#### v0.3.2

* fixes incorrect grunt dep
* adds coffee config file
* adds yaml support

#### v0.3.1

* fixes incorrect overwrite of passedin options for this task
* adds tests
* Updates examples and adds all various configuration possibilities

#### v0.3.0

* disallows function declaration anywhere else than as direct export
* extracts taskname regardless of file extension

#### v0.2.0

* adds coffeescript support
* adds parsing of taskname prefixed task targets
* fixes incorrect handling of functions at task config leaves

#### v0.1.0

* adds "by type' demo
* adds "by taskname" demo
* adds "single file" demo
* Initial commit

## License
Copyright (c) 2014 Camille Reynders
Licensed under the MIT license.

With special thanks to @stefanpenner and @thomasboyt.
This module is based on the ideas in Thomas' excellent tutorial:
http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html

[![Analytics](https://ga-beacon.appspot.com/UA-12080113-4/load-grunt-configs/README.md)](https://github.com/igrigorik/ga-beacon)

[grunt-generate-configs]: https://github.com/creynders/grunt-generate-configs
[config]: https://github.com/creynders/load-grunt-configs/tree/master/config