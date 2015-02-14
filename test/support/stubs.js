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
		},
        option : function(){
            return false;
        },
        verbose : {
            write : function(){}
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
