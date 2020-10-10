const express = require("express");
const http = require("http");
var app = express();
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbConfig = require("./config/database");
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
var path = require("path");
//const expressValidator = require('express-validator')
const niv = require("node-input-validator");
// const fileUpload = require("express-fileupload");
//concet to mongodb
const db = dbConfig.mongodburl;
// app.use(
//         fileUpload({
//           useTempFiles: true,
//           tempFileDir: "/public/",
//         })
//       );
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to mongo db"))
  .catch((err) => console.log(err));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

niv.extend("unique", async ({ value, args }) => {
  // default field is email in this example
  const field = args[1] || "email";

  let condition = {};

  condition[field] = value;

  // add ignore condition
  if (args[2]) {
    condition["_id"] = { $ne: mongoose.Types.ObjectId(args[2]) };
  }

  let emailExist = await mongoose
    .model(args[0])
    .findOne(condition)
    .select(field);

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
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", (req, res, next) => {
  next();
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const adminRoute = require("./route/admin");
const userRoute = require("./route/user");
const authUserRoute = require("./route/authUser");
const chatRoute = require("./route/chat");

app.use("/webservice/user", authUserRoute);
app.use("/webservice/user", userRoute);
app.use("/webservice/admin", adminRoute);
app.use("/webservice/chat", chatRoute);

var server = app.listen(8080, function () {
  console.log("server connected the port 8080");
});
var Socket = require("socket.io").listen(server);
var socketFile = require("./socket/socket");
// const io = Socket(server);
socketFile(Socket);
