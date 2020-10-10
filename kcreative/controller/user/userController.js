const User = require("./../../model/usersModel");
const Emailtemplates = require("./../../model/emailTempleteModel");
const bcrypt = require("bcryptjs");
const adminHelper = require("./../../helper/adminHelper");
const jwt = require("jsonwebtoken");
const appConfig = require("./../../config/app");
const mongoose = require("mongoose");
const formidable = require("formidable");
const mailSend = require("./../../helper/mailer");
const { base64encode, base64decode } = require("nodejs-base64");
const ObjectId = mongoose.Types.ObjectId;
const niv = require("node-input-validator");
const { Validator } = niv;
const fs = require("fs");

//const ISODate = mongoose.Types.ISODate;
const moment = require("moment");

const index = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
    }

    if (!fields.role || fields.role == "") {
      res.json({
        status: 0,
        message: "Bad request.",
        statuscode: 400,
        response: "",
      });
      return;
    }

    var filter = {};
    filter = { ...filter, ...{ role: fields.role } };

    if (fields.keyword && fields.keyword != "" && fields.keyword != undefined) {
      var search = fields.keyword;
      filter = {
        ...filter,
        ...{
          $or: [
            { email: { $regex: search, $options: "i" } },
            { companyname: { $regex: search, $options: "i" } },
            { phoneno: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
          ],
        },
      };
    }

    if (fields.businesstype && fields.businesstype != "") {
      var businesstype = fields.businesstype;
      filter = {
        ...filter,
        ...{
          businesstype: businesstype,
        },
      };
    }

    if (fields.freelancer_type && fields.freelancer_type != "") {
      var freelancer_type = fields.freelancer_type;
      filter = {
        ...filter,
        ...{
          freelancer_type: freelancer_type,
        },
      };
    }
    var start_date = "";
    var end_date = "";

    if (fields.start_date && fields.start_date != "") {
      start_date = new Date(
        moment(fields.start_date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      ).toISOString();
    }

    if (fields.end_date && fields.end_date != "") {
      end_date = new Date(
        moment(fields.end_date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      ).toISOString();
    }

    if (start_date != "" && end_date != "") {
      filter = {
        ...filter,
        ...{
          created: { $gte: start_date, $lte: end_date },
        },
      };
    } else if (start_date != "") {
      filter = {
        ...filter,
        ...{
          created: { $gte: start_date },
        },
      };
    } else if (end_date != "") {
      filter = {
        ...filter,
        ...{
          created: { $lte: end_date },
        },
      };
    }

    //console.log(JSON.stringify(filter));
    //set pagination logic
    var perPage = 5;
    var pageNumber = 1;
    if (fields.page) {
      pageNumber = fields.page;
    }
    var skipRecords = (pageNumber - 1) * perPage;

    User.find(filter).countDocuments((err, count) => {
      if (err) {
        res.json({
          status: 0,
          message: "Something went wrong",
          statuscode: 400,
          response: "",
        });
      }
      User.find(filter)
        .skip(skipRecords)
        .limit(perPage)
        .sort({ _id: -1 })
        .exec((err, result) => {
          if (err) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: "",
            });
          } else {
            response = {
              totalCount: count,
              perPage: perPage,
              totalPages: Math.ceil(count / perPage),
              currentPage: pageNumber,
            };

            if (result.length != 0) {
              response.records = result;
            }

            res.json({
              status: 1,
              message: "",
              statuscode: 200,
              response: response,
            });
          }
        });
    });
  });
};

const register = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log(fields);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
      return;
    }

    if (!fields.role || fields.role == "") {
      res.json({
        status: 0,
        message: "Role is required.",
        statuscode: 400,
        response: "",
      });
      return;
    }
    var v = new Validator();
    //validation for role 2 (client)
    if (fields.role == 2) {
      v = new Validator(fields, {
        first_name: "required",
        last_name: "required",
        email: "required|unique:Users,email",
        password: "required",
        companyname: "required",
        // phoneno: 'required',
        businesstype: "required",
        business_summary: "required",
        address: "required",
        city: "required",
        state: "required",
        zipcode: "required",
      });
    }

    //validation for role 3 (freelancer)
    if (fields.role == 3) {
      v = new Validator(fields, {
        first_name: "required",
        last_name: "required",
        email: "required|unique:Users,email",
        password: "required",
        freelancer_type: "required",
      });
    }

    await v
      .check()
      .then(function (matched) {
        if (!matched) {
          var errors = [];
          if ("name" in v.errors) {
            errors.push({ name: v.errors.name.message });
          }
          if ("first_name" in v.errors) {
            errors.push({ first_name: v.errors.first_name.message });
          }
          if ("last_name" in v.errors) {
            errors.push({ last_name: v.errors.last_name.message });
          }
          if ("email" in v.errors) {
            errors.push({ email: v.errors.email.message });
          }
          if ("password" in v.errors) {
            errors.push({ password: v.errors.password.message });
          }
          if ("freelancer_type" in v.errors) {
            errors.push({ freelancer_type: v.errors.freelancer_type.message });
          }

          if ("companyname" in v.errors) {
            errors.push({ companyname: v.errors.companyname.message });
          }
          if ("phoneno" in v.errors) {
            errors.push({ phoneno: v.errors.phoneno.message });
          }
          if ("businesstype" in v.errors) {
            errors.push({ businesstype: v.errors.businesstype.message });
          }
          if ("business_summary" in v.errors) {
            errors.push({
              business_summary: v.errors.business_summary.message,
            });
          }

          if ("address" in v.errors) {
            errors.push({ address: v.errors.address.message });
          }
          if ("state" in v.errors) {
            errors.push({ state: v.errors.state.message });
          }
          if ("city" in v.errors) {
            errors.push({ city: v.errors.city.message });
          }
          if ("zipcode" in v.errors) {
            errors.push({ zipcode: v.errors.zipcode.message });
          }

          // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
          // res.send(response);
          res.json({
            status: 0,
            message: "Bad request.",
            statuscode: 400,
            response: errors,
          });
        } else {
          //role 2 => client, 3=> freelancer

          var record = new User();

          record.first_name = fields.first_name;
          record.last_name = fields.last_name;
          record.email = fields.email;
          record.password = fields.password;
          record.role = +fields.role;

          record.email_confirmed = 0;
          if (fields.role == 2) {
            record.companyname = fields.companyname;
            // record.phoneno = fields.phoneno;
            record.businesstype = fields.businesstype;
            record.business_summary = fields.business_summary;
            record.appearas = fields.appearas;
            record.address = fields.address;
            record.state = fields.state;
            record.city = fields.city;
            record.zipcode = fields.zipcode;
            record.longitude = fields.longitude;
            record.latitude = fields.latitude;
            record.country = fields.country;
            record.approved = fields.businesstype == 2 ? 0 : 1;
            record.location = {
              type: "Point",
              coordinates: [
                fields.longitude ? parseFloat(fields.longitude) : 32,
                fields.latitude ? parseFloat(fields.latitude) : 32,
              ],
            };
          }
          if (fields.role == 3) {
            record.location = {
              type: "Point",
              coordinates: [
                fields.longitude ? parseFloat(fields.longitude) : 32,
                fields.latitude ? parseFloat(fields.latitude) : 32,
              ],
            };
            record.freelancer_type = fields.freelancer_type;
          }
          var otp = Math.floor(100000 + Math.random() * 900000);
          record.otp = otp;
          record.save(function (err1) {
            if (err1) {
              res.json({
                status: 0,
                message: "Something went wrong",
                statuscode: 400,
                response: err1,
              });
            } else {
              Emailtemplates.findOne(
                {
                  slug: "verify-link",
                },
                (err, template) => {
                  if (err) {
                    res.json({
                      status: 0,
                      message: "Something went wrong",
                      statuscode: 400,
                      response: err1,
                    });
                  } else {
                    if (template) {
                      var verifyLink =
                        appConfig.siteUrl +
                        "user/verify-link/" +
                        base64encode(String(record.email + ":" + otp));
                      verifyLink = `<a href='${verifyLink}'>${verifyLink}</a>`;
                      var templatereplace = template.content
                        .replace("{link}", verifyLink)
                        .replace(
                          "{name}",
                          record.first_name + " " + record.last_name
                        );
                      mailData = {
                        email: record.email,
                        subject: template.subject,
                        html: templatereplace,
                      };
                      let issEmailSent = mailSend(mailData);
                      if (issEmailSent == false) {
                        res.json({
                          status: 0,
                          message: "Mail is not send",
                          statuscode: 400,
                          response: err1,
                        });
                      } else {
                        record = JSON.stringify(record);
                        record = JSON.parse(record);
                        record.otp = otp;
                        record.otp_status = 1;
                        record.latitude = record.location.coordinates.latitude;
                        record.longitude =
                          record.location.coordinates.longitude;
                        record.image = record.image
                          ? appConfig.uploadUrl + "user/" + record.image
                          : "";
                        res.json({
                          status: 1,
                          message: "Please check your mail to verify account",
                          statuscode: 200,
                          response: record,
                        });
                      }
                    } else {
                      var verifyLink =
                        appConfig.siteUrl +
                        "user/verify-link/" +
                        base64encode(String(record.email + ":" + otp));
                      verifyLink = `<a href='${verifyLink}'>${verifyLink}</a>`;
                      let html = `Hi {name} 
                                            Link to verify your email is {link}
                                            KaliedTeam`;
                      var templatereplace = html
                        .replace("{link}", verifyLink)
                        .replace(
                          "{name}",
                          record.first_name + " " + record.last_name
                        );
                      mailData = {
                        email: record.email,
                        subject: "Register mail",
                        html: templatereplace,
                      };
                      let issEmailSent = mailSend(mailData);
                      if (issEmailSent == false) {
                        res.json({
                          status: 0,
                          message: "Mail is not send",
                          statuscode: 400,
                          response: err1,
                        });
                      } else {
                        record = JSON.stringify(record);
                        record = JSON.parse(record);
                        record.latitude = record.location.coordinates.latitude;
                        record.longitude =
                          record.location.coordinates.longitude;
                        record.otp = otp;
                        record.otp_status = 1;
                        res.json({
                          status: 1,
                          message: "Please check your mail to verify account",
                          statuscode: 200,
                          response: record,
                        });
                      }
                    }
                  }
                }
              );
            }
          });
        }
      })
      .catch(function (e) {
        res.json({
          status: 0,
          message: "Something went wrong",
          statuscode: 400,
          response: "",
        });
      });
  });
};

const view = function (req, res) {
  var user_id = req.params.id;

  User.findOne({ _id: ObjectId(user_id) }, function (err, result) {
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
    }
    if (!result) {
      res.json({
        status: 0,
        message: "User not found.",
        statuscode: 400,
        response: "",
      });
    } else {
      res.json({
        status: 1,
        message: "",
        statuscode: 200,
        response: result,
      });
    }
  });
};

const login = function (req, res) {
  var form = new formidable.IncomingForm();
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
      role: { $ne: 1 },
      status: { $ne: 0 },
    }).then((user) => {
      if (!user) {
        res.json({
          status: 0,
          message: `There is no account associated with ${email} email address.`,
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
          if (user.email_confirmed == 1) {
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
                  user.latitude = user.location.coordinates.latitude;
                  user.longitude = user.location.coordinates.longitude;
                  user.image = user.image
                    ? appConfig.uploadUrl + "user/" + user.image
                    : "";
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
            if (!user.otp) {
              let otp = Math.floor(1000 + Math.random() * 9000);
              user.otp = otp;
            }
            user.save((errs, user) => {
              if (errs) {
                res.json({
                  status: 0,
                  message: "Something went wrong",
                  statuscode: 400,
                  response: errs,
                });

                return;
              }
              {
                Emailtemplates.findOne(
                  {
                    slug: "verify-link",
                  },
                  (err, template) => {
                    if (err) {
                      res.json({
                        status: 0,
                        message: "Something went wrong",
                        statuscode: 400,
                        response: err1,
                      });
                    } else {
                      if (template) {
                        var verifyLink =
                          appConfig.siteUrl +
                          "user/verify-link/" +
                          base64encode(String(user.email + ":" + user.otp));
                        verifyLink = `<a href='${verifyLink}'>${verifyLink}</a>`;
                        var templatereplace = template.content
                          .replace("{link}", verifyLink)
                          .replace(
                            "{name}",
                            user.first_name + " " + user.last_name
                          );
                        mailData = {
                          email: user.email,
                          subject: template.subject,
                          html: templatereplace,
                        };
                        let issEmailSent = mailSend(mailData);
                        if (issEmailSent == false) {
                          res.json({
                            status: 0,
                            message: "Mail is not send",
                            statuscode: 400,
                            response: err1,
                          });
                        } else {
                          user = JSON.stringify(user);
                          user = JSON.parse(user);
                          user.latitude = user.location.coordinates.latitude;
                          user.longitude = user.location.coordinates.longitude;
                          user.otp_status = 1;
                          user.image = user.image
                            ? appConfig.uploadUrl + "user/" + user.image
                            : "";
                          res.json({
                            status: 1,
                            message: "Please check your mail to verify account",
                            statuscode: 200,
                            response: user,
                          });
                        }
                      } else {
                        var verifyLink =
                          appConfig.siteUrl +
                          "user/verify-link/" +
                          base64encode(String(user.email + ":" + otp));
                        verifyLink = `<a href='${verifyLink}'>${verifyLink}</a>`;
                        let html = `Hi {name} 
                                                Link to verify your email is {link}
                                                KaliedTeam`;
                        var templatereplace = html
                          .replace("{link}", verifyLink)
                          .replace(
                            "{name}",
                            record.first_name + " " + record.last_name
                          );
                        mailData = {
                          email: user.email,
                          subject: "Register mail",
                          html: templatereplace,
                        };
                        let issEmailSent = mailSend(mailData);
                        if (issEmailSent == false) {
                          res.json({
                            status: 0,
                            message: "Mail is not send",
                            statuscode: 400,
                            response: err1,
                          });
                        } else {
                          user = JSON.stringify(user);
                          user = JSON.parse(user);
                          user.latitude = user.location.coordinates.latitude;
                          user.longitude = user.location.coordinates.longitude;
                          user.otp_status = 1;
                          user.image = user.image
                            ? appConfig.uploadUrl + "user/" + user.image
                            : "";
                          res.json({
                            status: 1,
                            message: "Please check your mail to verify account",
                            statuscode: 200,
                            response: user,
                          });
                        }
                      }
                    }
                  }
                );
              }
            });
          }
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

const forgetPassword = function (req, res) {
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

      var otp = Math.floor(1000 + Math.random() * 9000);
      // Match password

      //user.otp = '';
      User.updateOne(
        {
          _id: ObjectId(user._id),
        },
        {
          $set: {
            otp: user.otp,
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
            Emailtemplates.findOne(
              {
                slug: "reset-password",
              },
              (err, template) => {
                if (err) {
                  res.json({
                    status: 0,
                    message: "Something went wrong",
                    statuscode: 400,
                    response: err1,
                  });
                } else {
                  if (template) {
                    var passwordResetUrl =
                      appConfig.siteUrl +
                      "user/reset-password/" +
                      base64encode(String(user._id));
                    passwordResetUrl = `<a href='${passwordResetUrl}'>${passwordResetUrl}</a>`;
                    var templatereplace = template.content.replace(
                      "{link}",
                      passwordResetUrl
                    );
                    mailData = {
                      email: record.email,
                      subject: template.subject,
                      html: templatereplace,
                    };
                    let issEmailSent = mailSend(mailData);
                    if (issEmailSent == false) {
                      res.json({
                        status: 0,
                        message: "Mail is not send",
                        statuscode: 400,
                        response: err1,
                      });
                    } else {
                      user = JSON.stringify(user);
                      user = JSON.parse(user);
                      //user.otp = otp;
                      user.otp_status = 1;
                      res.json({
                        status: 1,
                        message:
                          "Reset password link send successfully to your mail.",
                        statuscode: 200,
                        response: user,
                      });
                    }
                  } else {
                    var passwordResetUrl =
                      appConfig.siteUrl +
                      "user/reset-password/" +
                      base64encode(String(user._id));
                    mailData = {
                      email: fields.email,
                      subject: "Reset Password",
                      html: `Link to reset your password is <a href='${passwordResetUrl}'>Reset</a>`,
                    };
                    mailSend(mailData);

                    user = JSON.stringify(user);
                    user = JSON.parse(user);
                    //user.otp = otp;
                    user.otp_status = 1;
                    res.json({
                      status: 1,
                      message:
                        "Reset password link send successfully to your mail.",
                      statuscode: 200,
                      response: user,
                    });

                    return;
                  }
                }
              }
            );
          }
        }
      );
    });
  });
};

const verifyOtp = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var otp = fields.token;
    var email = fields.email;
    if (!otp) {
      res.json({
        status: 0,
        message: "Token is required.",
        statuscode: 400,
        response: "",
      });
    }
    if (!email) {
      res.json({
        status: 0,
        message: "email is required.",
        statuscode: 400,
        response: "",
      });
    }
    console.log({
      email: email,
      otp: +otp,
    });
    User.findOne({
      email: email,
      otp: +otp,
    }).then((user) => {
      console.log(user);
      if (!user) {
        res.json({
          status: 0,
          message: "Invalid token.",
          statuscode: 400,
          response: "",
        });
        return;
      }

      //user.otp = '';
      User.updateOne(
        {
          _id: ObjectId(user._id),
        },
        {
          $set: {
            //otp: "",
            email_confirmed: 1,
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
            const jwttoken = jwt.sign(JSON.stringify(user), appConfig.secret);
            user.token = jwttoken;
            User.updateOne(
              {
                _id: ObjectId(user._id),
              },
              {
                $set: {
                  token: jwttoken,
                  email_confirmed: 1,
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
                  user.latitude = user.location.coordinates.latitude;
                  user.longitude = user.location.coordinates.longitude;
                  user.image = user.image
                    ? appConfig.uploadUrl + "user/" + user.image
                    : "";
                  res.json({
                    status: 1,
                    message: "Account verified successfully.",
                    statuscode: 200,
                    response: user,
                  });

                  return;
                }
              }
            );
          }
        }
      );
    });
  });
};

const resetPassword = function (req, res) {
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

const changePassword = function (req, res) {
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
        }
      }
    });
  });
};

const updateProfile = function (req, res) {
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log(fields);
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
              user.image = user.image
                ? appConfig.uploadUrl + "user/" + user.image
                : "";

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

const resendOtp = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log(fields);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong.",
        statuscode: 400,
        response: "",
      });
      return;
    }
    if (!fields.email) {
      res.json({
        status: 0,
        message: "Email is required.",
        statuscode: 400,
        response: "",
      });
      return;
    }

    User.findOne(
      {
        email: fields.email,
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 0,
            message: "Something went wrong",
            statuscode: 400,
            response: "",
          });
          return;
        }
        if (!result) {
          res.json({
            status: 0,
            message: "User not found.",
            statuscode: 400,
            response: "",
          });
          return;
        } else {
          var otp = Math.floor(1000 + Math.random() * 9000);
          User.updateOne(
            {
              email: fields.email,
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
                Emailtemplates.findOne(
                  {
                    slug: "resend-otp",
                  },
                  (err, template) => {
                    if (err) {
                      res.json({
                        status: 0,
                        message: "Something went wrong",
                        statuscode: 400,
                        response: err1,
                      });
                      return;
                    } else {
                      if (template && template.description) {
                        var templatereplace = template.description
                          .replace("{otp}", otp)
                          .replace(
                            "{name}",
                            result.first_name + " " + result.last_name
                          );
                        mailData = {
                          email: result.email,
                          subject: template.subject,
                          html: templatereplace,
                        };
                        let issEmailSent = mailSend(mailData);
                        if (issEmailSent == false) {
                          res.json({
                            status: 0,
                            message: "Mail is not send",
                            statuscode: 400,
                            response: err1,
                          });
                        } else {
                          result = JSON.stringify(result);
                          result = JSON.parse(result);
                          result.otp = otp;
                          result.otp_status = 1;
                          // result.image = result.image ? appConfig.uploadUrl + 'user/' + result.image : "";
                          res.json({
                            status: 1,
                            message: "Please check your mail for otp",
                            statuscode: 200,
                            response: "",
                          });
                        }
                      } else {
                        let html = `Hi {name} Here's the One Time Code you'll need in order to verify to Kalied: {otp} Kalied Team`;
                        var templatereplace = html
                          .replace("{otp}", otp)
                          .replace(
                            "{name}",
                            result.first_name + " " + result.last_name
                          );
                        mailData = {
                          email: result.email,
                          subject: "Register mail",
                          html: templatereplace,
                        };
                        let issEmailSent = mailSend(mailData);
                        if (issEmailSent == false) {
                          res.json({
                            status: 0,
                            message: "Mail is not send",
                            statuscode: 400,
                            response: err1,
                          });
                          return;
                        } else {
                          result = JSON.stringify(result);
                          result = JSON.parse(result);
                          result.otp = otp;
                          result.otp_status = 1;
                          //result.image = result.image ? appConfig.uploadUrl + 'user/' + result.image : "";
                          res.json({
                            status: 1,
                            message: "Please check your mail for otp",
                            statuscode: 200,
                            response: "",
                          });
                          return;
                        }
                      }
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};

const updateGeoLocation = function (req, res) {
  User.find({}, async function (err, data) {
    await data.reduce(async (promise, ele) => {
      await promise;
      await User.findOne(
        {
          _id: ObjectId(ele._id),
        },
        async function (err2, user) {
          let dummy = user;
          dummy = JSON.parse(JSON.stringify(dummy));
          user.location = {
            type: "Point",
            coordinates: [
              dummy.longitude ? parseFloat(dummy.longitude) : 32,
              dummy.latitude ? parseFloat(dummy.latitude) : 32,
            ],
          };
          user.travel_distance = user.travel_distance
            ? parseFloat(user.travel_distance) * 1609.34
            : 0;
          await user.save(function (err3, data2) {
            console.log(err3, data2);
          });
        }
      );
    });
  });
};

module.exports = {
  login,
  register,
  forgetPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  updateProfile,
  view,
  index,
  resendOtp,
  updateGeoLocation,
};
