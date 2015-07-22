var View = require('./view');
var util = require('util');
var u = require('underscore');
var List = require('term-list'); //tj大婶,not node-term-list

var TopView = module.exports = function(bbs){
	View.call(this);
	this.bbs = bbs;
	this.topics;
	this.list;
};
util.inherits(TopView,View);
u.extend(TopView.prototype,{
	start:function(){
		//spider-bbs-top10
		
	},
});