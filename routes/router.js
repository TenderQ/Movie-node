var express = require('express');
var router = express.Router();

module.exports = function(app) {
	
	require('../controllers/index')(app);
	require('../controllers/detail')(app);
	require('../controllers/admin')(app);
	require('../controllers/list')(app);
	require('../controllers/user')(app);
};