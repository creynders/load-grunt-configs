loadTasks = require 'load-grunt-tasks'
loadConfigs = require './lib/load-grunt-configs'

module.exports = (grunt) ->

  loadTasks grunt

  configs =
    paths :
      build : ["config/*.coffee", "Gruntfile.coffee"]

  configs = loadConfigs grunt, configs

  grunt.initConfig configs

  grunt.registerTask 'default', ['coffeelint']
  grunt.registerTask 'vigilant', ['watch']
