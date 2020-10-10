var User = require("./../../model/usersModel");
const bcrypt = require("bcryptjs");
const adminHelper = require("./../../helper/adminHelper");
const jwt = require("jsonwebtoken");
const appConfig = require("./../../config/app");
const mongoose = require("mongoose");
var formidable = require("formidable");
var mailSend = require("./../../helper/mailer");
const { base64encode, base64decode } = require("nodejs-base64");
const ObjectId = mongoose.Types.ObjectId;
const { validationResult } = require("express-validator");
const validation = require("./../../validation/adminValidation");
var fs = require("fs");

const login = function (req, res) {
  var form = new formidable.IncomingForm();
  /*const errors = validationResult(req);
  console.log(errors);
  if(!errors.isEmpty()){

    res.json({
              status: 0,
              message: '',
              statuscode:400,
              response: errors
            });
    return;

  }*/
  form.parse(req, function (err, fields, files) {
    console.log(fields);

    var email = fields.email;
    var password = fields.password;
    if (!email || !password) {
      res.json({
        status: 0,
        message: "Email and password is required.",
        statuscode: 400,
        response: "",
      });
      return;
    }

    User.findOne({
      email: email,
      role: 1,
    }).then((user) => {
      if (!user) {
        res.json({
          status: 0,
          message: "Email is not registered",
          statuscode: 400,
          response: "",
        });
        return;
      }
      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          if (user && user.token != "") {
            user.token = "";
          }

          const jwttoken = jwt.sign(JSON.stringify(user), appConfig.secret);
          User.updateOne(
            {
              _id: ObjectId(user._id),
            },
            {
              $set: {
                token: jwttoken,
              },
            },
            (errs, resultnew) => {
              if (errs) {
                res.json({
                  status: 0,
                  message: "Something went wrong",
                  statuscode: 400,
                  response: errs,
                });

                return;
              } else {
                user = JSON.stringify(user);
                user = JSON.parse(user);
                user.token = jwttoken;
                res.json({
                  status: 1,
                  message: "Login successfully",
                  statuscode: 200,
                  response: user,
                });

                return;
              }
            }
          );
        } else {
          res.json({
            status: 0,
            message: "Password incorrect",
            statuscode: 400,
            response: "",
          });
        }
      });
    });
  });
};

const forget_password = function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    console.log(fields);
    var email = fields.email;
    User.findOne({
      email: email,
    }).then((user) => {
      if (!user) {
        res.json({
          status: 0,
          message: "Email is not registered",
          statuscode: 400,
          response: "",
        });
        return;
      }

      var otp = Math.floor(100000 + Math.random() * 900000);
      // Match password

      user.otp = "";
      User.updateOne(
        {
          _id: ObjectId(user._id),
        },
        {
          $set: {
            otp: otp,
          },
        },
        (errs, resultnew) => {
          if (errs) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: errs,
            });

            return;
          } else {
            var passwordResetUrl =
              appConfig.siteAdminUrl +
              "reset_password/" +
              base64encode(user._id + ":" + otp);
            mailData = {
              email: fields.email,
              subject: "Reset Password Otp",
              html:
                "Link to reset your password is <a href='" +
                passwordResetUrl +
                "'>Reset</a>",
            };
            mailSend(mailData);

            user = JSON.stringify(user);
            user = JSON.parse(user);
            user.otp = otp;
            user.otp_status = 1;
            res.json({
              status: 1,
              message: "Reset password link send successfully.",
              statuscode: 200,
              response: user,
            });

            return;
          }
        }
      );
    });
  });
};

const verify_otp = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var otp = fields.otp;
    if (!otp) {
      res.json({
        status: 0,
        message: "Otp is required.",
        statuscode: 400,
        response: "",
      });
    }
    User.findOne({
      otp: otp,
    }).then((user) => {
      if (!user) {
        res.json({
          status: 0,
          message: "Invalid otp.",
          statuscode: 400,
          response: "",
        });
        return;
      }

      user.otp = "";
      User.updateOne(
        {
          _id: ObjectId(user._id),
        },
        {
          $set: {
            otp: "",
          },
        },
        (errs, resultnew) => {
          if (errs) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: errs,
            });

            return;
          } else {
            user = JSON.stringify(user);
            user = JSON.parse(user);
            res.json({
              status: 1,
              message: "Otp verified successfully.",
              statuscode: 200,
              response: user,
            });

            return;
          }
        }
      );
    });
  });
};

const reset_password = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
    var user_id = fields.user_id;
    if (!user_id || !fields.password) {
      res.json({
        status: 0,
        message: "Bad request.",
        statuscode: 400,
        response: "",
      });
    }
    User.findOne({ _id: ObjectId(user_id) }, (err, user) => {
      if (err) {
        res.json({
          status: 0,
          message: "Something went wrong.",
          statuscode: 400,
          response: err,
        });
      }
      if (!user) {
        res.json({
          status: 0,
          message: "Invalid user.",
          statuscode: 400,
          response: "",
        });
      } else {
        bcrypt.hash(fields.password, 10, (err1, hash) => {
          if (err) {
            res.json({
              status: 0,
              message: "Something went wrong.",
              statuscode: 400,
              response: err,
            });
          }
          new_pass = hash;
          console.log(hash);
          User.updateOne(
            { _id: ObjectId(user._id) },
            { $set: { password: new_pass } },
            (err2, result) => {
              if (err) {
                res.json({
                  status: 0,
                  message: "Something went wrong.",
                  statuscode: 400,
                  response: err,
                });
              } else {
                console.log(result);

                res.json({
                  status: 1,
                  message: "Password reset successfully.",
                  statuscode: 200,
                  response: user,
                });
              }
            }
          );
        });
      }
    });
  });
};

const change_password = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (!fields.user_id || !fields.password || !fields.old_password) {
      res.json({
        status: 0,
        message: "Bad request.",
        statuscode: 400,
        response: "",
      });
    }
    User.findOne({ _id: ObjectId(fields.user_id) }, (err1, user) => {
      if (err) {
        res.json({
          status: 0,
          message: "Something went wrong.",
          statuscode: 400,
          response: err,
        });
      }
      if (!user) {
        res.json({
          status: 0,
          message: "Invalid user.",
          statuscode: 400,
          response: "",
        });
      } else {
        if (user.comparePassword(fields.old_password)) {
          user.password = "";
          var new_pass = "";
          bcrypt.hash(fields.password, 10, function (err2, hash) {
            if (err) {
              res.json({
                status: 0,
                message: "Something went wrong.",
                statuscode: 400,
                response: err,
              });
            }
            new_pass = hash;
            User.updateOne(
              { _id: ObjectId(user._id) },
              { $set: { password: new_pass } },
              (err3, result) => {
                if (err) {
                  res.json({
                    status: 0,
                    message: "Something went wrong.",
                    statuscode: 400,
                    response: err,
                  });
                  return;
                }

                res.json({
                  status: 1,
                  message: "Password changed successfully.",
                  statuscode: 200,
                  response: user,
                });
              }
            );
          });
        } else {
          res.json({
            status: 0,
            message: "Old password not matched",
            statuscode: 400,
            response: "",
          });
          return;
        }
      }
    });
  });
};

const update_profile = function (req, res) {
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log(fields, files);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong.",
        statuscode: 400,
        response: "",
      });
    }
    let fileName = "";
    if (files.profile_image && files.profile_image.name) {
      fileName =
        new Date().getTime() + files.profile_image.name.replace(" ", "-");
      var oldpath = files.profile_image.path;
      var newpath = __dirname + "/../../public/uploads/user/" + fileName;
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          res.json({
            status: 0,
            message: "Something went wrong.",
            statuscode: 400,
            response: "",
          });
        }
      });
    }

    User.findOne({ _id: ObjectId(fields.user_id) }, function (err1, result) {
      if (err1) {
        res.json({
          status: 0,
          message: "Something went wrong.",
          statuscode: 400,
          response: "",
        });
      }
      if (!result) {
        res.json({
          status: 0,
          message: "User data not found.",
          statuscode: 400,
          response: "",
        });
      } else {
        let updateObject = { name: fields.name };
        if (fileName.length != 0) {
          updateObject.image = fileName;
          var old_image =
            __dirname + "/../../public/uploads/user/" + result.image;
          fs.unlink(old_image, (err) => {
            if (err) {
              res.json({
                status: 0,
                message: "Something went wrong.",
                statuscode: 400,
                response: "",
              });
              return;
            }
          });
        }
        //console.log(updateObject);
        User.findOneAndUpdate(
          { _id: ObjectId(fields.user_id) },
          updateObject,
          function (err2, user) {
            //console.log(err2);
            if (err2) {
              res.json({
                status: 0,
                message: "Something went wrong.",
                statuscode: 400,
                response: "",
              });
            }
            //console.log(user);
            if (user) {
              user.name = fields.name;
              user.image = fileName.length != 0 ? fileName : user.image;

              res.json({
                status: 1,
                message: "Profile updated successfully.",
                statuscode: 200,
                response: user,
              });
            } else {
              res.json({
                status: 0,
                message: "Profile not updated successfully.",
                statuscode: 400,
                response: user,
              });
            }
          }
        );
      }
    });
  });
};

module.exports = {
  login,
  forget_password,
  verify_otp,
  reset_password,
  change_password,
  update_profile,
};
