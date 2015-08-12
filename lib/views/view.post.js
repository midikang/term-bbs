var View = require('./view');
var util = require('util');
var u = require('underscore');
var List = require('term-list');
var spider = require('../data/spider');
var Grid = require('term-grid');
var config = require('../data/config')

var PostView = module.exports = function(postid){
	if (!postid) {
		throw new Error('PostView function need postid');
	};
	View.call(this);
	if (postid.indexOf('byr')!=-1) {
		this.bbs = '1';
	};
	if (postid.indexOf('newsmth')!=-1) {
		this.bbs = '2';
	};
	this.postid = postid;
	this.post;
	this.list = null;
};

util.inherits(PostView,View);
u.extend(PostView.prototype,{
	start:function(){
		var postUrl = '';
		if (-1 != this.postid.indexOf('byr')) {
			postUrl = this.postid + '?_uid=guest';
		}
		if (-1 != this.postid.indexOf('newsth')) {
			postUrl = '';
		};
		spider(postUrl,(function(err,result){
			if (err) {
				return console.log(err);
			};
			this.post = result;
			this.initList();
		}).bind(this));
	},
	initList:function(){
		var _self = this;
		var list = new List({ marker: '\033[36m- \033[0m', markerLength: 2 });
		this.post.forEach(function(line,idx){
			if (idx < 3) {
				var grid = new Grid([[line]]);
				grid.setColor(0,'green');
				var lineContent = grid._compileRow(0);
				list.add(idx,lineContent);
			};
		});
		list.start();
		_self.initMain();
		list.on('keypress',function(key,item){
			if (key.name == 'backspace') {
				_self.emit('back',_self.bbs);
			};
			if (key.name == 'c' && key.ctrl) {
				list.stop();
				process.exit();
			};
			if (key.name == 'up') {
				_self.flag = false;
			};
			if (key.name == 'down'&&item == 2) {
				if(!_self.flag){
					_self.flag = true;
					_self.initMain();
				}
			};
		});
	},
	initMain:function(){
		for(var i = 0;i<this.post.length;i++){
			var _l;
			if (i>2) {
				_l = this.post[i]=='__NewLine'?' ':this.post[i];
				console.log(_l);
			};
		}
		process.stdin.resume();
	},
	end:function(){
		if (this.list) {
			this.list.stop();
		};
	}
});