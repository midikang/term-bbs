var ListView = require('./views/view.list');
var TopView = require('./views/view.top');
var PostView = require('./views/view.post');

var bbs = module.exports = function(){
	bbs.list(); //列出bbs目录
};

//view的缓存
var viewCache = {
	list:null,
	topten:{},
};

bbs.list = function(){
	var listView = viewCache.list || new ListView();
	listView.start();
	listView.on('select',function(bbsId){
		listView.end();
		bbs.topten(bbsId);
	});
};
bbs.topten = function(bbsid){
	var topView = viewCache.topten.bbsid || new TopView(bbsid);

	topView.start();
	topView.on('back',function(){
		topView.end();
		bbs.list();
	});
	topView.on('select',function(post){
		topView.end();
		bbs.post(post);
	});
};
bbs.post = function(post){
	var postView = new PostView(post);
	postView.start();
	postView.on('back',function(id){
		postView.end();
		bbs.topten(id);
	})
};