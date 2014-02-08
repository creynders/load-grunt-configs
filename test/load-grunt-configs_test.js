'use strict';

var _ = require('lodash');
var grunt = require('grunt');
var pq = require('proxyquire').noCallThru();
var stubs = require('./fixtures/stubs');
var configs = require('./fixtures/configs');
var stubDeps = _.cloneDeep(configs);
stubDeps.path = stubs.path;

var loadGruntConfigs = pq('../lib/load-grunt-configs',stubDeps);
var uuid = require('node-uuid');

exports['suite'] = function(test){
	test.expect(1);
	test.ok(true, 'test whether test suite is found.');
	test.done();
};

exports['should use passed in options for this task'] = function(test){
	test.expect(1);
	var config = {config:{src:[uuid.v4()]}};
	var actual = loadGruntConfigs(stubs.grunt([]), config);
	test.deepEqual(actual, config);
	test.done();
};

exports['should parse a single target in a single file'] = function(test){
	test.expect(1);
	var actual = loadGruntConfigs(stubs.grunt(['target']));
	test.deepEqual(actual.target, configs.target);
	test.done();
};

exports['should parse multiple targets in a single file'] = function(test){
	test.expect(1);
	var actual = loadGruntConfigs(stubs.grunt(['targets']));
	test.deepEqual(actual.targets, configs.targets);
	test.done();
};

exports['should use result of function when present'] = function(test){
	test.expect(1);
	var actual = loadGruntConfigs(stubs.grunt(['func']));
	test.deepEqual(actual.func, configs.func());
	test.done();
};

exports['should parse "tasks" and ignore filename'] = function(test){
	test.expect(2);
	var actual = loadGruntConfigs(stubs.grunt(['tasks']));
	test.deepEqual(actual.task1, configs.tasks.tasks.task1);
	test.deepEqual(actual.task2, configs.tasks.tasks.task2);
	test.done();
};

exports['should parse "tasks" as a result of function when present'] = function(test){
	test.expect(2);
	var actual = loadGruntConfigs(stubs.grunt(['functasks']));
	test.deepEqual(actual.task1, configs.functasks().tasks.task1);
	test.deepEqual(actual.task2, configs.functasks().tasks.task2);
	test.done();
};

exports['should parse colon-joined properties'] = function(test){
	test.expect(2);
	var actual = loadGruntConfigs(stubs.grunt(['coloned']));
	test.deepEqual(actual.task1, configs.tasks.tasks.task1);
	test.deepEqual(actual.task2, configs.tasks.tasks.task2);
	test.done();
};

exports['should overwrite passed in task configs'] = function(test){
	test.expect(2);
	var actual = loadGruntConfigs(stubs.grunt(['overwrite']), configs.passedin);
	test.deepEqual(actual.task1, configs.overwrite.tasks.task1);
	test.deepEqual(actual.task2, configs.overwrite.tasks.task2);
	test.done();
};

