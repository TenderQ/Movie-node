var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var oDate = require("../../libs/date");

var KeywordSchema = new mongoose.Schema({
	keyword: String,
	count: {
		type: Number,
		default: 0
	},
	createtime: {
		type: String,
		default: oDate.Format("yyyy-MM-dd HH:mm:ss")
	},
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

KeywordSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})
KeywordSchema.statics = {
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id: id}).exec(cb);
	},
	delete: function(id,cb){
		return this.remove({_id: id}).exec(cb);
	},
}
module.exports = KeywordSchema;