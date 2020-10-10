var express = require('express');
var path = require('path');
var body_parser = require('body-parser');
var fs = require('fs');
var app = express();

 /*Local Work Start */
var port = 3000;
var https = app;
/** Local Work End **/

/** Demo Work Start **/
//var port = 17278;
//var httpsOn = require('http');
// var privateKey = fs.readFileSync('/etc/letsencrypt/live/devnode.devtechnosys.tech/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/devnode.devtechnosys.tech/cert.pem', 'utf8');
// var ca = fs.readFileSync('/etc/letsencrypt/live/devnode.devtechnosys.tech/chain.pem', 'utf8');
//var credentials = { key: privateKey, cert: certificate, ca: ca };
//var https = httpsOn.createServer(credentials, app);
/** Demo Work End **/
const niv = require('node-input-validator');

var mongoose = require('mongoose');


niv.extend('unique', async ({ value, args }) => {
	// default field is email in this example
	const field = args[1] || 'email';

	let condition = {};

	condition[field] = value;

	// add ignore condition
	if (args[2]) {
		condition['_id'] = { $ne: mongoose.Types.ObjectId(args[2]) };
	}

	let emailExist = await mongoose.model(args[0]).findOne(condition).select(field);

	// email already exists
	if (emailExist) {
		return false;
	}

	return true;
});

mongoose.connect("mongodb://localhost:27017/kaleidocreative", { useNewUrlParser: true, useFindAndModify: false });
var adminRoutes = require('./server/routes/admin');
var apiRoutes = require('./server/routes/api');

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	next();
});

app.get('/',function(req,res){
	console.log(req.body);
	var jsonData = { "string": "Hello World!!" }
	res.send(jsonData);
});




app.use('/admin',adminRoutes);
app.use('/api',apiRoutes);




/** 404 Work Start **/
var dir = path.join(__dirname, 'public');

var mime = {
	html: 'text/html',
	txt: 'text/plain',
	css: 'text/css',
	gif: 'image/gif',
	jpg: 'image/jpeg',
	png: 'image/png',
	svg: 'image/svg+xml',
	js: 'application/javascript'
};

app.all('*',function(req,res){		
	var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));	
	if (file.indexOf(dir + path.sep) !== 0) {
			return res.status(403).end('Forbidden');
	}
	var type = mime[path.extname(file).slice(1)] || 'text/plain';
	var s = fs.createReadStream(file);
	
	s.on('open', function () {
			res.set('Content-Type', type);
			s.pipe(res);
	});
	s.on('error', function () {
			res.set('Content-Type', 'text/plain');
			res.status(404).end('Not found');
	});
	// var jsonData = { status: 404, message: "Page Not Found", response: [] };
	// res.send(jsonData);
});
/** 404 Work Start **/

https.listen(port, function(){	
	console.log("App listening: http://localhost:"+port);
})
