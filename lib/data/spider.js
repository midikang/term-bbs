var config = require('./config');
var request = require('request');
var cheerio = require('cheerio');

var topics = [];
var spider = module.exports = function(bbs,cb){
	var url = config[bbs];
	request(url,function(err,res,body){
		if (err) {
			cb(err);
		}
		if (res&&res.statusCode == 200) {
			var $ = cheerio.load(body);
			$('#topten li').each(function(idx,el){
				var $el = $(el);
				var title = $el.attr('title');
				if (//) {};
				topics.push([
						idx.toString(),
						$el.attr('title'),

					]);
			});
		}
	});
};