var express = require('express');
var router = express.Router();
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');

module.exports = function(app) {
	//pre handler
	app.use(function(req,res,next){
		var _user = req.session.user;
		
		app.locals.user = _user;

		return next();
	})
	
	app.get('/', Index.index);
	
	app.get('/movie/:id',Movie.detail);
	app.post('/movie/comment/reply',User.signinRequired,Comment.reply);
	app.get('/admin/movie/addEdit', User.signinRequired,User.adminRequired,Movie.movie);
	app.get('/admin/movie/addEdit/:id', User.signinRequired,User.adminRequired,Movie.update);
	app.post('/admin/movie/add', User.signinRequired,User.adminRequired,Movie.add);
	app.get('/admin/movie/list', User.signinRequired,User.adminRequired, Movie.list);
	app.get('/admin/movie/delete', User.signinRequired,User.adminRequired, Movie.delete);
	
	app.get('/register', User.register);
	app.post('/user/signin', User.signin);
	app.post('/user/signup', User.signup);
	app.get('/user/logout', User.logout);
	
};