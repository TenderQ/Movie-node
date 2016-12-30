var _ = require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');

exports.movie= function(req, res) {
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
		}
	})
}

exports.detail = function(req, res) {
	var id = req.params.id;

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
				title: '电影详情',
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
			res.render('addEdit',{
				title: '电影编辑',
				movie: movie
			})
		});
	}
}

exports.add = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(id !== ''){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			_movie = _.extend(movie,movieObj);

			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+_movie.id)
			})
		})
	} else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			actors: movieObj.actors,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash,
		})

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			res.redirect('/');
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
				res.json({'success': 1});
			}
			
			
		})
	}
}