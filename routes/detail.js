var Movie = require('../models/movie');
module.exports = function(app){
	app.get('/movie/:id', function(req, res) {
		var id = req.params.id;

		Movie.findById(id, function(err,movie){
			if(err){
				console.log(err);
			}
			res.render('detail',{
				title: '电影详情',
				movie: movie
			})
		});
		
	});
};;