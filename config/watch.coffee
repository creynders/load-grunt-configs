module.exports = (grunt, options) ->
  return {
    tasks:
      "watch:build":
        files: '<%= paths.build %>'
        tasks: ['coffeelint:build']
  }