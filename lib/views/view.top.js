var View = require('./view');
var util = require('util');
var u = require('underscore');
var List = require('term-list');
var spider = require('../data/spider');
var Grid = require('term-grid');
var config = require('../data/config')

var TopView = module.exports = function(bbs){
	View.call(this);
	this.bbs = bbs;
	this.topics;
	this.list;
};
util.inherits(TopView,View);
u.extend(TopView.prototype,{
	start:function(){
		spider(this.bbs.toString(),(function(err,results){
			if (err) {
				return  console.log(err);
			}
			this.topics = results;
			this.initList();
		}).bind(this));
        //http://www.ibm.com/developerworks/cn/web/1207_wangqf_jsthis/index.html
	},
	initList:function(){
		var self = this;
		var list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 });
		this.topics.forEach(function(topic){
			var link = config[this.bbs.toString()].host +  topic.link;
			//装配进入Grid，并且格式化输出第一行
			var grid = new Grid([topic.content]);
			grid.setWidth(0,5);
			grid.setColor(1,"green");
			grid.setColor(2,"red");
			var option =  grid._compileRow(0);
			//增加进入list
			list.add(link,option);
		},self);
		this.list = list;
		list.start();
		//选择事件
		list.on('keypress', function(key, item){
		  switch (key.name) {
		    case 'return':
		      self.emit('select',item);
		      break;
		    case 'c':
		      if (key.ctrl) {
		        list.stop();
		        process.exit();
		      }
		      break;
		    case 'backspace':
		    	//list.stop();
		    	self.emit('back');
		    	break;
		  }
		});
	},
	end:function(){
		if (this.list) {
			this.list.stop();
		}
	}
});