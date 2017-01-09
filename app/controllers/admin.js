var Keyword = require('../models/keyword');

exports.index= function(req, res) {
	res.render('admin',{
		title: '后台管理',
	})
}

exports.keywordList = function(req,res){	
	Keyword.fetch(function(err,keywords){
		if(err) console.log(err);
		res.render('keyword_list',{
			title: '关键词列表',
			keywords: keywords
		})	
	})
}

exports.keywordDelete = function(req,res){
	var id = req.query.id;

	if(id){
		Keyword.delete(id,function(err,keyword){
			if(err){
				console.log(err);
			} else {
				res.json({'success': true});
			}	
		})
	}
}
