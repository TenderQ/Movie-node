var mongoose = require('mongoose')
var KeywordSchema = require('../schemas/keyword')
var Keyword = mongoose.model('Keyword',KeywordSchema)

module.exports  = Keyword 