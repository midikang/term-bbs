var config = require('./config.json');
var request = require('request');
var cheerio = require('cheerio');

var topics = [];

var spider = module.exports = function(bbs,cb){
	//注意bbs用了ajax;
	var url = !parseInt(bbs)?bbs:config[bbs].main;  //spider bbs top10 or each hot topic main content
	var options = {
		url:url,
		headers:{
			'X-Requested-With':'XMLHttpRequest'
		}
	};
	request(options,function(err,res,body){
		if (err) {
			cb(err);
		}
		if (res&&res.statusCode == 200) {
			var $ = cheerio.load(body);
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