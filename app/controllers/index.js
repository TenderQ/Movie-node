var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var Keyword = require('../models/keyword');

exports.index = function(req, res) {

	Category.find({}).populate({path:'movies'}).exec(function(err,categorys){
			if(err)  console.log(err);
			Movie.find({}).sort({pv: -1}).limit(10).exec(function(err,movies){

				res.render('index',{
					title: '爱生活，爱电影',
					category: categorys,
					ranks: movies
				});
			})
	})
}

exports.search = function(req,res){
	var catId = req.query.cat;
	var search_text = req.query.search_text;
	var page = parseInt(req.query.p) || 0;
	var count = 10; //每页展示电影数量
	var start = page * count;
	
	if(catId){
		Category.find({_id:catId}).populate({path:'movies'}).exec(function(err,categorys){
			if(err){
				console.log(err);
			}
			var category = categorys[0] || {};
			var movies = category.movies || [];
			var totalPage = Math.ceil(movies.length / count);
			var results = movies.slice(start,start + count);
			
			res.render('search',{
				title: '查询结果',
				keyword: category.name,
				currentPage: page + 1,
				totalPage: totalPage, 
				movies: results
			});
		})
	} else {
		//如果搜索词不为空，保存搜索关键词
		if(search_text != ''){
			Keyword.findOne({keyword:search_text},function(err,keyword){
				if(err)	console.log(err);
				if(!keyword){
					var _keyword = new Keyword({
						keyword:  search_text,
						count: 1
					});	
					_keyword.save(function(err,keyword){
						if(err)	console.log(err);
					})
				} else {
					Keyword.update({_id:keyword._id},{$inc:{count:1}},function(err){
						if(err)	console.log(err);
					})
				}
			})
		}
		Movie.find({title: new RegExp(search_text+".*",'i')}).exec(function(err,movies){
			if(err){
				console.log(err);
			}
	
			var totalPage = Math.ceil(movies.length / count);
			var results = movies.slice(start,start + count);
			
			Keyword.find({}).sort({count: -1}).limit(10).exec(function(err,keywords){
				res.render('search',{
					title: '查询结果',
					keyword: search_text,
					currentPage: page + 1,
					totalPage: totalPage, 
					movies: results,
					keywords: keywords
				});
			})
		})
	}
}
