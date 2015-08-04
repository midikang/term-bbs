var config = require('./config.json');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var topics = [];

var spider = module.exports = function(bbs,cb){
	//注意bbs用了ajax;
	var url = !parseInt(bbs)?bbs:config[bbs].main;  //spider bbs top10 or each hot topic main content
	var options = {
		url:url,
		encoding:null,
		headers:{
			'X-Requested-With':'XMLHttpRequest'
		}
	};
	request(options,function(err,res,body){
		if (err) {
			cb(err);
		}
		if (res&&res.statusCode == 200) {
			//http://blog.leanote.com/post/tcstory/Node.js%E6%8A%93%E5%8F%96%E4%B8%AD%E6%96%87%E7%BD%91%E9%A1%B5%E7%9A%84%E4%B9%B1%E7%A0%81%E9%97%AE%E9%A2%98
			var $ = cheerio.load(iconv.decode(body,'gb2312').toString());
			//北邮人
			if(bbs == '1'){
				$('#topten li').each(function(idx,el){
					var $el = $(el);
					var topicLink = $el.find('a').first().attr('href').toString();
					var title = $el.attr('title');
					topics.push({
						link:topicLink,
						content:[
							idx.toString(),
							title,
							_hot(title)
						]
					});

				});
			}
			//水木
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
							idx.toString(),
							catgory + ' ' + title,
							_hot(title)
						]
					});
				});
			}
			cb(null,topics);

			//Todo:if(/http/.test(bbs))
		}
	});
};

//帮助方法
/*
 *取得话题的热度（hot）
 */

function _hot(title){
	return /(\(\d+\))/.test(title)?RegExp.$1:"(0)";
}