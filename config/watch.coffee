module.exports.tasks = (grunt, options) ->
  return {
    "watch:build":
      files: '<%= paths.build %>'
      tasks: ['coffeelint:build']
  }