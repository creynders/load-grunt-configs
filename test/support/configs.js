var path = require('path');

module.exports.target = {
	target : {
		value : 'single target value'
	}
};

module.exports.targets = {
	target1 : {
		value : 'first target value'
	},
	target2 : {
		value : 'second target value'
	}
};

module.exports.func = function(g, o){
	return {
		target : {
			value : 'single target value'
		}
	};
};

var tasks = {
	tasks : {
		task1 : {
			target1 : {
				value : 'task1: first target value'
			},
			target2 : {
				value : 'task1: second target value'
			}
		},
		task2 : {
			target1 : {
				value : 'task2: first target value'
			},
			target2 : {
				value : 'task2: second target value'
			}
		}
	}
};

module.exports.tasks = tasks;

module.exports.functasks = function(g, o){
	return {
		tasks : {
			task1 : {
				target1 : {
					value : tasks.tasks.task1.target1.value
				},
				target2 : {
					value : tasks.tasks.task1.target2.value
				}
			},
			task2 : {
				target1 : {
					value : tasks.tasks.task2.target1.value
				},
				target2 : {
					value : tasks.tasks.task2.target2.value
				}
			}
		}
	};
};

module.exports.coloned = {
	tasks : {
		"task1:target1" : tasks.tasks.task1.target1,
		"task1:target2" : tasks.tasks.task1.target2,
		"task2:target1" : tasks.tasks.task2.target1,
		"task2:target2" : tasks.tasks.task2.target2
	}
};

var passedin = module.exports.passedin = {
	task1 : {
		target1 : 'task 1, target1 default value'
	},
	task2 : {
		target1 : {
			value1 : 'task2, target1 default value1',
            value3 : 'task2, target1 default value3'
		},
		target2 : {
			value1 : 'task2, target2 original value1',
			value2 : 'task2, target2 original value2'
		}
	}
};

var overwrite = module.exports.overwrite = {
	tasks : {
		task1 : {
			target1 : 'task 1, target1 overwritten value'
		},
		task2 : {
			target1 : {
				value1 : 'task2, target1 overwritten value1',
				value2 : 'task2, target1 original value2'
			}
		}
	}
};

module.exports.merged = {
    task1 : overwrite.tasks.task1,
    task2 : {
        target1 : {
            value1 : overwrite.tasks.task2.target1.value1,
            value2 : overwrite.tasks.task2.target1.value2,
            value3 : passedin.task2.target1.value3
        },
        target2 : passedin.task2.target2
    }
}