var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	director: String,
	title: String,
	actors: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: String,
	meta:{
		createAt:{
			type:Date,
			default: Date.now()
		},
		updateAt:{
			type:Date,
			default: Date.now()
		}
	}
})

MovieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})
MovieSchema.statics = {
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id: id}).exec(cb);
	},
	delete: function(id,cb){
		return this.remove({_id: id}).exec(cb);
	},
	update: function(id,newObj,cb){
		return this.update({_id: id},newObj).exec(cb);
	},
}
module.exports = MovieSchema