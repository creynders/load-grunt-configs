# load-grunt-configs
[![npm version](https://badge.fury.io/js/load-grunt-configs.svg)](http://badge.fury.io/js/load-grunt-configs)
[![Build Status](https://secure.travis-ci.org/creynders/load-grunt-configs.svg?branch=master)](http://travis-ci.org/creynders/load-grunt-configs)

> Loads grunt task configurations from separate files.

Grunt files tend to grow fast due to big amount of tasks and their configuration objects.
**This module allows you to split your Grunt task configuration objects into separate files any way you choose.**
There are similar modules that allow you to the same, but with `grunt-load-configs` **you can configure targets for a single task in multiple files**.

This means you no longer need to group all task targets into a single file, but can split them up according to their task dependencies.

#### Example

you use the `watch` task to recompile your `.scss` files, but also to lint your source `.js` whenever one has changed. Typically you'd add a single `watch` configuration object to configure this, but with `load-grunt-configs` you can split these into several files and group all task targets together whenever it makes sense:

```javascript

//config/css.js

module.exports.tasks = {
    watch : {
        scss : {
            files : ['app/sass/*.{scss,sass}'],
            tasks : ['compass:source']
        }
    },
    compass : {
        source : {
            //configuration settings
        }
    }
};

//config/lint.js

module.exports.tasks = {
    watch : {
        lint : {
            files : ['app/{,*/}*.js']
            tasks : ['jshint:source']
        }
    },
    jshint : {
        source : {
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
$ npm install grunt-generate-configs -g
# cd to your project directory containing the Gruntfile
$ generate_configs
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
    "gruntfile" : {
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
     gruntfile : {
         src : "Gruntfile.js"
     }
 }
 ```

 Or by exposing a function which returns an object:

```javascript
//config/jshint.js
module.exports = function(grunt, options) {
     return {
         gruntfile : {
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
            "gruntfile" : {
                "src" : "Gruntfile.js"
            }
        },
        "watch"  : {
            "gruntfile" : {
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
    "tasks" : {
        "jshint" : {
            "test" : {
                "src" : ["test/**/*.js"]
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
In this way, you can declare custom tasks on your config files (especially useful if you follow the "Split multi-task configurations" method above).

```javascript
// Gruntfile.js
var options = {
    paths : {
        jshintrc : '.jshintrc'
    }
};

var configs = require('load-grunt-configs')(grunt, options);

// config/jshint.js
module.exports = function(grunt, options) {
    grunt.registerTask('custom', ['jshint:gruntfile']);

    return {
        options : {
            jshintrc : '<%= paths.jshintrc %>'
        },

        gruntfile : {
            src : 'Gruntfile.js'
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
    "watch:gruntfile" : {
        src : "Gruntfile.js",
        tasks : ['jshint:gruntfile']
    }
}

```

This makes it easier when in the future you'd like to move the `watch:gruntfile` task configuration to another file for instance.

### Troubleshooting

The tradeoff of a neatly organized Grunt configuration is sometimes having trouble locating which file is declaring exactly what.

In that case, or if loading some file is causing an error and aborting your Grunt process, you can always run:

```shell
grunt --verbose
```

A nice log of processed files and loaded tasks/targets will help you locate the problems. Here's the output when running
on this very repo:


```
Loading grunt configs via "load-grunt-configs" from 6 file(s).
Loading config/connect.js...is fn(), invoking...OK
+ connect: [options, docs]

Loading config/jshint.json...OK
+ jshint: [options, lib, build, test]

Loading config/watch.js...is fn(), invoking...OK
+ watch: [lib, build, test, docs, livereload]

Loading config/clean.coffee...is fn(), invoking...OK
+ clean: [config, tmp]

Loading config/nodeunit.yml...OK
+ nodeunit: [load_grunt_configs]

Loading config/markdown.cson...OK
+ markdown: [docs]

```


## Options

You can modify the directory in which the configuration files need to reside:

```javascript
//Gruntfile.js
var options = {
    config : {
        src : "options/*.js"
    }
};

configs = require('load-grunt-configs')(grunt, options);
```

Will search for the configuration files in an `options` directory.

You can also supply a customizer function for the configuration merging:

```javascript
//Gruntfile.js
var options = {
    config : {
        mergeCustomizer : function(a, b) {
            return Array.isArray(a) ? a.concat(b) : undefined;
        }
    }
};

configs = require('load-grunt-configs')(grunt, options);
```

See [lodash#merge](https://lodash.com/docs#merge) for more information on the customizer function.


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
    "gruntfile" : {
        "src" : "Gruntfile.js"
    }
}
```

* **json with multiple task configurations**: E.g. configures `jshint` and `watch` tasks in `config/<whatever makes sense to you>.json`. Note the top-most key "tasks" here, it alerts the module not to extract the task name from the file name.

```json
{
    "tasks" : {
        "jshint" : {
            "gruntfile" : {
                "src" : "Gruntfile.js"
            }
        },
        "watch" : {
            "gruntfile" : {
                "src" : "Gruntfile.js",
                "tasks" : ["jshint:gruntfile"]
            }
        }
    }
}
```

* **json with multiple task configurations using task prefixed targets**: E.g. configures `jshint` and `watch` tasks in `config/<whatever makes sense to you>.json`

```json
{
    "tasks" : {
        "jshint:gruntfile" : {
            "src" : "Gruntfile.js"
        },
        "watch:gruntfile" : {
            "src" : "Gruntfile.js",
            "tasks" : ["jshint:gruntfile"]
        }
    }
}
```

* **js with single task configuration as an object**: E.g. configures `jshint` task in `config/jshint.js`

```javascript
module.exports = {
     gruntfile : {
         src : "Gruntfile.js"
     }
};
```

* **js with single task configuration as a function**: E.g. configures `jshint` task in `config/jshint.js`

```javascript
module.exports = function(grunt, options) {
    return {
        gruntfile : {
            src : "Gruntfile.js"
        }
    };
};
```

* **js with multiple task configurations as an object**: E.g. configures `jshint` and `watch` task in `config/<whatever makes sense to you>.js`

```javascript
module.exports.tasks = { //note the `tasks` export here [!]
    jshint : {
        gruntfile : {
            src : "Gruntfile.js"
        }
    },
    watch : {
        gruntfile : {
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
        tasks : {
            jshint : {
                gruntfile : {
                    src : "Gruntfile.js"
                }
            },
            watch : {
                gruntfile : {
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
    "jshint:gruntfile" : {
        src : "Gruntfile.js"
    },
    "watch:gruntfile" : {
            src : "Gruntfile.js",
            tasks : ['jshint:gruntfile']
    }
};
```

* **js with multiple task configurations as a function using task prefixed targets**: E.g. configures `jshint` and `watch` task in `config/<whatever makes sense to you>.js`

```javascript
module.exports = function(grunt, options) {
    return {
        tasks : {
            "jshint:gruntfile" : {
                src : "Gruntfile.js"
            },
            "watch:gruntfile" : {
                src : "Gruntfile.js",
                tasks : ['jshint:gruntfile']
            }
        }
    };
};
```

## Changelog

* __v0.4.3__:
    * Update dependencies
    * Swap cson-safe to cson-parser
    * add `mergeCustomizer`
* __v0.4.2__: Explicit bailing on invalid task config
* __v0.4.1__: Better verbose output
* __v0.4.0__: Switch to cson-safe for parsing cson
* __v0.3.3__:
    * Add cson support
    * Loads yaml files with safeLoad
* __v0.3.2__:
    * fixes incorrect grunt dep
    * adds coffee config file
    * adds yaml support
* __v0.3.1__:
    * fixes incorrect overwrite of passedin options for this task
    * adds tests
    * Updates examples and adds all various configuration possibilities
* __v0.3.0__:
    * disallows function declaration anywhere else than as direct export
    * extracts taskname regardless of file extension
* __v0.2.0__:
    * adds coffeescript support
    * adds parsing of taskname prefixed task targets
    * fixes incorrect handling of functions at task config leaves
* __v0.1.0__:
    * adds "by type' demo
    * adds "by taskname" demo
    * adds "single file" demo
    * Initial commit

## Contributors

* [creynders](https://github.com/creynders)
* [janraasch](https://github.com/janraasch)
* [andrezero](https://github.com/andrezero)
* [kingcody](https://github.com/kingcody)
* [jkrems](https://github.com/jkrems)
* [henriquesilverio](https://github.com/HenriqueSilverio)
* [gianos](https://github.com/gianos)
* [varemenos](https://github.com/varemenos)

## License
Copyright (c) 2014 Camille Reynders
Licensed under the MIT license.

With special thanks to @stefanpenner and @thomasboyt.
This module is based on the ideas in Thomas' excellent tutorial:
http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html

[![Analytics](https://ga-beacon.appspot.com/UA-12080113-4/load-grunt-configs/README.md)](https://github.com/igrigorik/ga-beacon)

[grunt-generate-configs]: https://github.com/creynders/grunt-generate-configs
[config]: https://github.com/creynders/load-grunt-configs/tree/master/config
