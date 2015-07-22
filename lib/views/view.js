var EventEmitter = require('events').EventEmitter;
var util = require('util');
var u = require('underscore');

var View = module.exports = function(){
	EventEmitter.call(this);
};
util.inherits(View,EventEmitter);
u.extend(View.prototype,{
	constructor:View,

	//start(基类的方法统一子类的操作)
	start:function(){},
	//end
	end:function(){}

});