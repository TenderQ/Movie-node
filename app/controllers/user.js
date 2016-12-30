var User = require('../models/user');

exports.register= function(req,res){
	res.render('register',{
		title: '用户注册',
	})
}

exports.signin = function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		//用户不存在
		if(!user){
			return res.json({'fail':"用户名不存在"});
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				req.session.user = user;
				return res.redirect('/');
			} else {
				return res.json({'fail':"密码错误"});
			}
		});
	})
}
	
exports.signup = function(req,res){
	var userObj = req.body.user;

	//查找用户，判断用户是否已注册
	User.findOne({name:userObj.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			return res.json({"fail":"用户已存在"});
		} else {
			var _user = new User(userObj)
			_user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect('/');
			});
		}
	})
}
	
exports.logout = function(req,res){
	delete req.session.user;
	res.redirect('/');
}
// 登陆控制
exports.signinRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/');
	}
	next();
}
// 权限控制
// 0: user, 1: verified user, 2: professonal user , >10 admin, >100 super admin
exports.adminRequired = function(req,res,next){
	var user = req.session.user;
	//角色权限>=10为管理员，否则无权限继续
	if(!user.role || user.role < 10){
		return res.redirect('/');
	}
	next();
}