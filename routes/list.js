var Movie = require('../models/movie');

module.exports = function(app){

	app.get('/list', function(req, res) {
		Movie.fetch(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render('list',{
				title: '电影列表',
				movies: movies
			});
			
		})
	});

	app.get('/list/delete', function(req, res) {
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
		
	});
};