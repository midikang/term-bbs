var View = require('./view');
var util = require('util');
var u = require('underscore');
var List = require('term-list'); //tj大婶,not node-term-list

var ListView = module.exports = function(){
	View.call(this);
	this.bbss;
	this.list;
};
util.inherits(ListView,View);

u.extend(ListView.prototype,{
	start:function(){
		this.bbss = [
			{
				'id':1,
				'name':'北邮人'
			},
			{
				'id':2,
				'name':'水木社区'
			}
		];
		this.initList();
	},
	initList:function(){
		var self = this;
		var list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 });
		this.bbss.forEach(function(bbs){
			list.add(bbs.id.toString(),bbs.name);
		});
		this.list = list;
		list.start();
		list.on('keypress', function(key, item){
		  switch (key.name) {
		    case 'return':
		      self.emit('select',item)
		      break;
		    case 'c':
		      if (key.ctrl) {
		        list.stop();
		        process.exit();
		      }
		      break;
		  }
		});
	},
	end:function(){
		this.list.stop();
	}
});