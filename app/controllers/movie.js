var _ = require('underscore');
var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var fs =require('fs');
var path = require('path');

exports.movie= function(req, res) {
	Category.fetch(function(err,categorys){
		res.render('addEdit',{
			title: '后台录入',
			movie:{
				director:'',
				actors: '',
				country:'',
				title:'',
				year:'',
				poster:'',
				language:'',
				flash:'',
				summary:''
			},
			categorys: categorys
		})
	})
	
}

exports.detail = function(req, res) {
	var id = req.params.id;
	
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err);
		}
	})
	
	Movie.findById(id, function(err,movie){
		
		Comment
		  .find({movie:id})
		  .populate("from","name")
		  .populate('reply.from reply.to', 'name')
		  .exec(function(err,comments){
			if(err){
				console.log(err);
			}
			res.render('detail',{
				title: movie.title + ' - 详情',
				movie: movie,
				comments: comments
			})
		});
	});
}

exports.update = function(req, res) {
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err,movie){
			if(err){
				console.log(err);
			}
			Category.fetch(function(err,categorys){
				if(err){
					console.log(err);
				}
				res.render('addEdit',{
					title: '电影编辑',
					movie: movie,
					categorys: categorys
				})
			});
		});
	}
}

exports.add = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

//	if(req.poster){
//		movieObj.poster = req.poster;
//	}
	
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			_movie = _.extend(movie,movieObj);

			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
//				res.redirect('/movie/'+_movie.id)
				res.json({"success":true,"data":"编辑电影成功"});
			})
		})
	} else {
		_movie = new Movie(movieObj);
		
		var categoryId = _movie.category;
		
		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			Category.findById(categoryId,function(err,category){
				if(err){
					console.log(err);
				}
				category.movies.push(movie._id);
				category.save(function(err,category){
//					res.redirect('/admin/movie/list');
					res.json({"success":true,"data":"添加电影成功"});
				})
			})
		});
	}
}

exports.list = function(req, res) {
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: '电影列表',
			movies: movies
		});
	})
}

exports.delete = function(req, res) {
	var id = req.query.id;

	if(id){
		Movie.delete(id,function(err,movie){
			if(err){
				console.log(err);
			} else {
				res.json({'success': true});
			}
			
			
		})
	}
}

exports.fileUpload = function(req,res){
	var postData = req.files.file;
	var filePath = postData.path;
	var originalFilename = postData.originalFilename;
	
	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();
			var type = postData.type.split('/')[1];
			var poster = timestamp+'.'+type;
			var newPath = path.join(__dirname,'../../','public/upload/'+poster);
			fs.writeFile(newPath,data,function(err){
				var src = '/upload/' + poster;
				res.json({'src':src});
			});
		});
	}
}

exports.uploadPoster = function(req,res,next){
	var postData = req.files.uploadPoster;
	
	var filePath = postData.path;
	var originalFilename = postData.originalFilename;
	
	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();
			var type = postData.type.split('/')[1];
			var poster = timestamp+'.'+type;
			var newPath = path.join(__dirname,'../../','public/upload/'+poster);
			fs.writeFile(newPath,data,function(err){
				req.poster = '/upload/' + poster;
				next();
			});
		});
	} else {
		next();
	}
}
