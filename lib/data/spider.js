var config = require('./config.json');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var spider = module.exports = function(bbs,cb){

	var url = !parseInt(bbs)?bbs:config[bbs].main;
	if (!url) {
		cb(new Error('spider function bbs parameter can\'t be empity or null'));
	};
	var options = {
		url:url,
		encoding:null,
		headers:{
			'X-Requested-With':'XMLHttpRequest'
		}
	};
	request(options,function(err,res,body){
		var topics = [];
		if (err) {
			cb(err);
		}
		if (res&&res.statusCode == 200) {
			//http://blog.leanote.com/post/tcstory/Node.js%E6%8A%93%E5%8F%96%E4%B8%AD%E6%96%87%E7%BD%91%E9%A1%B5%E7%9A%84%E4%B9%B1%E7%A0%81%E9%97%AE%E9%A2%98
			var $ = cheerio.load(iconv.decode(body,'gb2312').toString());
			if(bbs == '1'){
				$('#topten li').each(function(idx,el){
					var $el = $(el);
					var topicLink = $el.find('a').first().attr('href').toString();
					var title = $el.attr('title');
					topics.push({
						link:topicLink,
						content:[
							(idx+1).toString(),
							title,
							_hot(title)
						]
					});

				});
			}
			if (bbs == '2') {
				$('#top10 li').each(function(idx,el){
					var $li = $(el);
					var $topicCatgory = $li.find('a').first();
					var catgory = $topicCatgory.attr('title');
					var title = $topicCatgory.next().attr('title');
					var link = $topicCatgory.next().attr('href');
					topics.push({
						link:link,
						content:[
							(idx+1).toString(),
							catgory + ' ' + title,
							_hot(title)
						]
					});
				});
			}

			//<img>/<font>等请求bug,待修改
			if (bbs.indexOf('byr')!=-1) {
				 var c = [];
				 var brs = $('.a-content-wrap').first().children();
				 c[0] = brs[0].prev.data;
				 c[1] = brs[0].next.data;
				 c[2] = brs[1].next.data;
				 var i = 2;

				 var _next = function(node){
				 	var _n = node.next;
				 	if (_n.name === 'br') {
				 		i++;
				 		c[i] = '__NewLine';
				 		return _next(_n);
				 	}
				 	if (_n.type == 'text') {
				 		i++;
				 		c[i] = _n.data;
				 		return _next(_n);
				 	}
				 };
				 _next(brs[2]);

				 return cb(null,c);
			};
			cb(null,topics);
		}
	});
};

function _hot(title){
	return /(\(\d+\))/.test(title)?RegExp.$1:"(0)";
}