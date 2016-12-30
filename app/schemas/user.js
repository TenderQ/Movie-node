var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name:{
		unique: true,
		type: String
	},
	password: String, 
	// 0: user, 1: verified user, 2: professonal user , >10 admin, >100 super admin
	role: {
		type: Number,
		default: 0
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

UserSchema.pre('save',function(next){
	var user = this

	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err);

		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err) return next(err);

			user.password = hash;
			next();
		});
	});
//	next();
})
UserSchema.statics = {
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findByName: function(name,cb){
		return this.findOne({name: name}).exec(cb);
	},
}

UserSchema.methods = {
	comparePassword: function(password,cb){
		bcrypt.compare(password,this.password,function(err,isMatch){
			if(err) return cb(err);
			
			cb(null,isMatch);
		})
	}
}

module.exports = UserSchema