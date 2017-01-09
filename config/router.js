var express = require('express');
var router = express.Router();
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
var Admin = require('../app/controllers/admin');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


module.exports = function(app) {
	//pre handler
	app.use(function(req,res,next){
		var _user = req.session.user;
		app.locals.user = _user;
		return next();
	})
	
	app.get('/', Index.index);
	//查询
	app.get('/search',Index.search);
	
	app.get('/movie/:id',Movie.detail);
	app.post('/movie/comment/reply',User.signinRequired,Comment.reply);
	
	app.get('/admin',User.signinRequired,User.adminRequired,Admin.index)
	app.get('/admin/movie/addEdit', User.signinRequired,User.adminRequired,Movie.movie);
	app.get('/admin/movie/addEdit/:id', User.signinRequired,User.adminRequired,Movie.update);
	app.post('/admin/movie/add',User.signinRequired,User.adminRequired,Movie.add);
	app.get('/admin/movie/list', User.signinRequired,User.adminRequired, Movie.list);
	app.get('/admin/movie/delete', User.signinRequired,User.adminRequired, Movie.delete);
	
	app.get('/admin/keyword/list', User.signinRequired,User.adminRequired, Admin.keywordList);
	app.get('/admin/keyword/delete', User.signinRequired,User.adminRequired, Admin.keywordDelete);
	//图片上传
	app.post('/admin/movie/fileUpload', User.signinRequired,User.adminRequired,multipartMiddleware,Movie.fileUpload);
	
	app.get('/register', User.register);
	app.post('/user/signin', User.signin);
	app.post('/user/signup', User.signup);
	app.get('/user/logout', User.logout);
	app.get('/admin/user/list', User.signinRequired,User.adminRequired,User.list);
	
	//分类
	app.get('/admin/category', User.signinRequired,User.adminRequired,Category.new);
	app.post('/admin/category/add', User.signinRequired,User.adminRequired,Category.add);
	app.get('/admin/category/edit/:id', User.signinRequired,User.adminRequired,Category.update);
	app.get('/admin/category/list', User.signinRequired,User.adminRequired, Category.list);
	app.get('/admin/category/delete', User.signinRequired,User.adminRequired, Category.delete);
	
	//404错误处理
	app.use(function(req, res, next) {
		var err = new Error('404 Not Found');
		err.status = 404;
		next(err);
	});
	
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			title: '404',
			message: err.message,
			error: {}
		});
	});
};