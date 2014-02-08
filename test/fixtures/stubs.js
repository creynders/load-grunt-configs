var _ = require('lodash');

module.exports.dummy = {
	file : {
		expand : function(){
			return [];
		}
	}
};

module.exports.grunt = function(files){
	return {
		file : {
			expand : function(){
				return files;
			}
		}
	};
};

module.exports.path = {
	resolve : function(filepath){
		return filepath;
	},
	basename : function(filename){
		return filename;
	},
	extname : function(){
		return '';
	}
};