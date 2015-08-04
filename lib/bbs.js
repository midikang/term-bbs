var ListView = require('./views/view.list');
var TopView = require('./views/view.top');

var bbs = module.exports = function(){
	bbs.list(); //列出bbs目录
};

bbs.list = function(){
	var listView = new ListView();
	listView.start();
	listView.on('select',function(bbsId){
		listView.end();
		bbs.topten(bbsId);
	});
};
bbs.topten = function(bbsid){
	var topView = new TopView(bbsid);
	topView.start();
	topView.on('back',function(){
		topView.end();
		bbs.list();
	})
};