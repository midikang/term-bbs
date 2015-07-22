var ListView = require('./views/view.list');

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
bbs.topten = function(bbs){
	var topView = new TopView(bbs);
	topView.start();
};