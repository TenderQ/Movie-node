var Category = require('../models/category');
var _ = require('underscore');

exports.new = function(req,res){
	res.render('category',{
		title: '分类录入',
		category: {
			name: ''
		}
	})
}

exports.add = function(req,res){
	var id = req.body.category._id;
	var categoryObj = req.body.category;
	var _category;
	if(id !== ''){
		Category.findById(id,function(err,category){
			if(err)	console.log(err);
			_category = _.extend(category,categoryObj);
			_category.save(function(err,category){
				if(err){
					console.log(err);
				}
				res.json({"success":true,"data":"编辑分类成功"});
			})
		})
	} else {
		_category = new Category({
			name: categoryObj.name,
		})

		_category.save(function(err,movie){
			if(err){
				console.log(err);
			}
			res.json({"success":true,"data":"新增分类成功"});
		});
	}
}


exports.update = function(req, res) {
	var id = req.params.id;

	if(id){
		Category.findById(id, function(err,category){
			if(err){
				console.log(err);
			}
			res.render('category',{
				title: '分类编辑',
				category: category
			})
		});
	}
}


exports.list = function(req,res){	
	Category.fetch(function(err,categorys){
		if(err) console.log(err);
		res.render('category_list',{
			title: '分类列表',
			categorys: categorys
		})	
	})
}

exports.delete = function(req,res){	
	var id = req.query.id;
	if(id){
		Category.delete(id,function(err,category){
			if(err){
				console.log(err);
			} 
			res.json({'success':true});
		})
	}
}