var express = require('express');
var path = require('path');
var port = process.env.PORT || 4000;
var routes = require('./config/router');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var template = require('art-template');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var fs = require('fs');
var app = express();
var env = process.env.NODE_ENV || 'development';

var dbUrl = 'mongodb://localhost/movie';
mongoose.Promise = global.Promise;
app.locals.moment = require('moment');
mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs.readdirSync(path).forEach(function(file){
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		
		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath);
			} else if(stat.isDirectory){
				walk(newPath);
			}
		}
	})
}
walk(models_path);
// 用art-template引擎替换默认的jade引擎
app.set("views","./app/views");
template.config('base','');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');// app.set("view engine","jade");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit:"50mb"}));
app.use(cookieParser());
app.use(session({
	secret:"movie",
	resave: true, 
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions',
	}),
	cookie: {maxAge: 1000 * 60 * 60 * 24},
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images/lib', 'favicon.ico')));

//路由设置
//app.use('/', routes);
routes(app);

// 错误处理
if(env === 'development'){
	app.set("showStackError",true);
	app.use(logger(':method :url :status'));
	mongoose.set("debug",true);
}
app.listen(port);
console.log("server started on port:" + port);

// module.exports = app;
