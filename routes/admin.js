var _ = require('underscore');
var Movie = require('../models/movie');

module.exports = function(app) {
	app.get('/admin', function(req, res) {
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
	})

	app.get('/admin/update/:id', function(req, res) {
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
	})

	app.post('/admin/add',function(req,res){
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
//					res.redirect('/movie/'+_movie.id)
					res.redirect('/');
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
	})
}