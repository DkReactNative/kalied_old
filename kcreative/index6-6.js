const express = require('express');
//const http = require('http');
var app = express();
var mongoose = require('mongoose');
const bodyParser = require("body-parser");
const dbConfig = require("./config/database");
const passport = require("passport");
require("./config/passport")(passport);
const cors = require('cors');
var path = require('path');
//const expressValidator = require('express-validator')
const niv = require('node-input-validator');
//concet to mongodb 
const fs = require("fs");
const db = dbConfig.mongodburl;
mongoose.connect(db,{
	 useNewUrlParser: true, useFindAndModify: false
}).then(()=> console.log('connected to mongo db'))
	.catch(err => console.log(err));

app.use(bodyParser.urlencoded({
    extended: true
}));

console.log = function () {}

var httpsOn = require('https');
var privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/devnode.devtechnosys.tech/privkey.pem",
  "utf8"
);
var certificate = fs.readFileSync(
  "/etc/letsencrypt/live/devnode.devtechnosys.tech/cert.pem",
  "utf8"
);
var ca = fs.readFileSync(
  "/etc/letsencrypt/live/devnode.devtechnosys.tech/chain.pem",
  "utf8"
);
var credentials = { key: privateKey, cert: certificate, ca: ca };

var https = httpsOn.createServer(credentials, app);


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


//use express validation
//app.use(expressValidator());

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

const adminRoute = require('./route/admin');
const userRoute = require('./route/user');
const authUserRoute = require('./route/authUser')
app.use('/webservice/user', authUserRoute);
app.use('/webservice/user', userRoute);
app.use('/webservice/admin', adminRoute);

var server = https.listen(17315,function(){
	console.log('server connected the port 17315');
})