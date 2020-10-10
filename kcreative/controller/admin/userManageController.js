const User = require("../../model/usersModel");

const Skill = require("../../model/skills&AwardModel");
const PortFolios = require("./../../model/portFoliosModel");
const Projecttype = require("./../../model/projectTypeModel");
const Industrytype = require("../../model/industryTypeModel");
const Generaltype = require("../../model/genereTypeModel");
const Emailtemplates = require("../../model/emailTempleteModel");
const bcrypt = require("bcryptjs");
const adminHelper = require("../../helper/adminHelper");
const jwt = require("jsonwebtoken");
const Myfunction = require("../../helper/myfunctions");
const appConfig = require("../../config/app");
const mongoose = require("mongoose");
const formidable = require("formidable");
const mailSend = require("../../helper/mailer");
const { base64encode, base64decode } = require("nodejs-base64");
const ObjectId = mongoose.Types.ObjectId;
const niv = require("node-input-validator");
const { Validator } = niv;
const fs = require("fs");
//const ISODate = mongoose.Types.ISODate;
const moment = require("moment");
const userController = require("../user/userController");
const usersModel = require("../../model/usersModel");
const { db } = require("../../model/usersModel");
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
      return;
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
    filter = { ...filter, ...{ role: fields.role, status: { $ne: 0 } } };

    if (fields.keyword && fields.keyword != "" && fields.keyword != undefined) {
      var search = fields.keyword;
      filter = {
        ...filter,
        ...{
          $or: [
            { email: { $regex: search, $options: "i" } },
            { companyname: { $regex: search, $options: "i" } },
            { phoneno: { $regex: search, $options: "i" } },
            { first_name: { $regex: search, $options: "i" } },
            { last_name: { $regex: search, $options: "i" } },
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
        moment(new Date(fields.start_date), ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      ).toISOString();
      console.log(start_date);
    }

    if (fields.end_date && fields.end_date != "") {
      end_date = new Date(
        moment(new Date(fields.end_date), ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      ).toISOString();
      console.log(end_date);
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
        return;
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
            return;
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
            return;
          }
        });
    });
  });
};
const create = function (req, res) {
  console.log(req);
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

    //validation for role 2 (client)
    if (fields.role == 2) {
      var v = new Validator(fields, {
        first_name: "required",
        last_name: "required",
        email: "required|unique:Users,email",
        password: "required",
        companyname: "required",
        phoneno: "required",
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
      var v = new Validator(fields, {
        name: "required",
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
          record.role = fields.role;
          record.email_confirmed = 0;
          if (fields.role == 2) {
            record.address = fields.address;
            record.state = fields.state;
            record.city = fields.city;
            record.zipcode = fields.zipcode;
            record.country = fields.country;
            record.latitude = fields.latitude;
            record.longitude = fields.longitude;
            record.companyname = fields.companyname;
            // record.phoneno = fields.phoneno;
            record.businesstype = fields.businesstype;
            record.business_summary = record.business_summary;
          }
          if (fields.role == 3) {
            record.freelancer_type = fields.freelancer_type;
          }
          var otp = Math.floor(1000 + Math.random() * 9000);
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
                  slug: "verification_otp",
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
                      var templatereplace = template.description
                        .replace("{otp}", otp)
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
                        res.json({
                          status: 1,
                          message: "Please check your mail for otp",
                          statuscode: 200,
                          response: record,
                        });
                      }
                    } else {
                      let html = `Hi {name} 

                                            Here's the One Time Code you'll need in order to verify email to Kalied: 
                                            
                                            {otp}
                                            KaliedTeam`;
                      var templatereplace = html
                        .replace("{otp}", otp)
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
                        record.otp = otp;
                        record.otp_status = 1;
                        res.json({
                          status: 1,
                          message: "Please check your mail for otp",
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
const remove = function (req, res) {
  //console.log(req);
  var userId = req.params.id;
  User.findOne({ _id: ObjectId(userId) }, function (err, result) {
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
      result.status = 0;
      result.save(function (err, user) {
        if (err) {
          res.json({
            status: 0,
            message: "Something went wrong",
            statuscode: 400,
            response: "",
          });
          return;
        } else {
          res.json({
            status: 1,
            message: "User deleted successfully.",
            statuscode: 200,
            response: "",
          });
          return;
        }
      });
    }
  });
};
const update = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log(fields);
    if (err) {
      console.log(err);
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
        email: "required|unique:Users,email," + req.params.id,
        // password: 'required',
        companyname: "required",
        // phoneno: 'required',
        businesstype: "required",
        business_summary: "required",
        address: "required",
        appearas: "required",
        // city: 'required',
        // state: 'required',
        // zipcode: 'required'
      });
    }

    //validation for role 3 (freelancer)
    if (fields.role == 3) {
      v = new Validator(fields, {
        first_name: "required",
        last_name: "required",
        email: "required|unique:Users,email" + req.params.id,
        //password: 'required',
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
          if ("appearas" in v.errors) {
            errors.push({ appearas: v.errors.appearas.message });
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
          return;
        } else {
          User.findOne({ _id: ObjectId(req.params.id) }, function (
            err1,
            result
          ) {
            if (err1) {
              res.json({
                status: 0,
                message: "Something went wrong.",
                statuscode: 400,
                response: "",
              });
              return;
            }
            if (!result) {
              res.json({
                status: 0,
                message: "User data not found.",
                statuscode: 400,
                response: "",
              });
              return;
            } else {
              record = {};
              record.first_name = fields.first_name;
              record.last_name = fields.last_name;
              record.email = fields.email;
              // record.password = fields.password;
              record.role = +fields.role;
              // record.phoneno =fields.phoneno;

              record.email_confirmed = 1;
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
              }
              if (fields.role == 3) {
                record.freelancer_type = fields.freelancer_type;
              }
              User.findOneAndUpdate(
                { _id: ObjectId(req.params.id) },
                record,
                function (err2, user) {
                  //console.log(err2);
                  if (err2) {
                    res.json({
                      status: 0,
                      message: "Something went wrong.",
                      statuscode: 400,
                      response: "",
                    });
                    return;
                  }
                  //console.log(user);
                  if (user) {
                    // user.name = fields.name;
                    // user.image = (fileName.length != 0) ? fileName : user.image;

                    res.json({
                      status: 1,
                      message: "Profile updated successfully.",
                      statuscode: 200,
                      response: user,
                    });
                    return;
                  } else {
                    res.json({
                      status: 0,
                      message: "Profile not updated successfully.",
                      statuscode: 400,
                      response: user,
                    });
                    return;
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
        return;
      });
  });
};

const changeStatus = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
      return;
    }
    User.findOne({ _id: fields.id }, function (err, result) {
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
        result.status = fields.status;
        result.save(function (err, user) {
          if (err) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: "",
            });
            return;
          } else {
            res.json({
              status: 1,
              message: "User status updated successfully.",
              statuscode: 200,
              response: "",
            });
            return;
          }
        });
      }
    });
  });
};

const view = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    User.aggregate(
      [
        {
          $match: {
            _id: ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: "skills",
            localField: "_id",
            foreignField: "user_id",
            as: "skill_data",
          },
        },
        {
          $lookup: {
            from: "primaryskills",
            let: { pid: { $arrayElemAt: ["$skill_data.primary_skills", 0] } },
            pipeline: [
              {
                $addFields: {
                  _id: {
                    $toString: "$_id",
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$pid"],
                  },
                },
              },
            ],
            as: "primary_skill_data",
          },
        },
        {
          $lookup: {
            from: "secondaryskills",
            let: { pid: { $arrayElemAt: ["$skill_data.secondary_skills", 0] } },
            pipeline: [
              {
                $addFields: {
                  _id: {
                    $toString: "$_id",
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$pid"],
                  },
                },
              },
            ],
            as: "secondary_skill_data",
          },
        },
        {
          $lookup: {
            from: "graphicspecailities",
            let: {
              pid: { $arrayElemAt: ["$skill_data.graphic_specialities", 0] },
            },
            pipeline: [
              {
                $addFields: {
                  _id: {
                    $toString: "$_id",
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$pid"],
                  },
                },
              },
            ],
            as: "graphic_specialities_data",
          },
        },
        {
          $lookup: {
            from: "editingstyles",
            let: {
              pid: { $arrayElemAt: ["$skill_data.editing_style", 0] },
            },
            pipeline: [
              {
                $addFields: {
                  _id: {
                    $toString: "$_id",
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$pid"],
                  },
                },
              },
            ],
            as: "editing_style_data",
          },
        },
        {
          $lookup: {
            from: "awards",
            let: {
              pid: { $arrayElemAt: ["$skill_data.awards", 0] },
            },
            pipeline: [
              {
                $addFields: {
                  _id: {
                    $toString: "$_id",
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$pid"],
                  },
                },
              },
            ],
            as: "awards_data",
          },
        },
        {
          $lookup: {
            from: "expertiselevels",
            localField: "_id",
            foreignField: "user_id",
            as: "expertise_level_data",
          },
        },
        {
          $lookup: {
            from: "recommendations",
            localField: "_id",
            foreignField: "user_id",
            as: "recommendation_data",
          },
        },
        {
          $lookup: {
            from: "portfolios",
            localField: "_id",
            foreignField: "user_id",
            as: "portfolio_data",
          },
        },
        {
          $lookup: {
            from: "previouclients",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$user_id", "$$id"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  created: 1,
                  client_name: 1,
                  role: 1,
                  end_date: 1,
                  start_date: 1,
                  user_id: 1,
                  workedAs: {
                    $cond: {
                      if: { $eq: ["$workedAs", 0] },
                      then: "Freelancer",
                      else: "Staff",
                    },
                  },
                },
              },
            ],
            as: "previous_client_data",
          },
        },
      ],
      async function (err, result) {
        if (err) {
          return res.send(Myfunction.failResponse("Something went wrong", err));
        }
        if (result.length == 0) {
          return res.send(Myfunction.failResponse("User Not Found"));
        } else {
          let response = {};
          response.result = result[0];
          let project_type = await Projecttype.find().select({
            _id: 1,
            name: 1,
          });
          let type = {};
          project_type.map((ele) => {
            type[ele._id] = ele.name;
          });
          response.project_type = type;

          let industry_type = await Industrytype.find().select({
            _id: 1,
            name: 1,
          });
          let industype = {};
          industry_type.map((ele) => {
            industype[ele._id] = ele.name;
          });
          response.industry_type = industype;

          let general_type = await Generaltype.find().select({
            _id: 1,
            name: 1,
          });
          let gentype = {};
          general_type.map((ele) => {
            gentype[ele._id] = ele.name;
          });
          response.general_type = gentype;

          return res.send(Myfunction.successResponse("data", response));
        }
      }
    );
  });
};

// const view = function (req, res) {

//     var form = new formidable.IncomingForm();
//     form.parse(req, async function (err, fields) {
//         User.findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
//             if (err) {

//                 res.json({
//                     status: 0,
//                     message: 'Something went wrong',
//                     statuscode: 400,
//                     response: ''
//                 });
//                 return;
//             }
//             if (!result) {
//                 res.json({
//                     status: 0,
//                     message: 'User not found.',
//                     statuscode: 400,
//                     response: ''
//                 });
//                 return;
//             } else {
//                 res.json({
//                     status: 1,
//                     message: '',
//                     statuscode: 200,
//                     response: result
//                 });
//                 return;
//             }
//         });
//     });
// }

const approve = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
      return;
    }
    User.findOne({ _id: fields.id }, function (err, result) {
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
        result.approved = fields.approve;
        result.save(function (err, user) {
          if (err) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: "",
            });
            return;
          } else {
            res.json({
              status: 1,
              message: "User approved successfully.",
              statuscode: 200,
              response: user,
            });
            return;
          }
        });
      }
    });
    // }
  });
};

const portfolioIndex = (req, res) => {
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
    var pageNumber = fields.page ? fields.page : 1;
    var perPage = 10;
    var json = {};
    PortFolios.aggregate(
      [
        {
          $lookup: {
            from: "users",
            let: { user_id: "$user_id", id: "$_id", status: "$status" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", "$$user_id"] },
                      { $in: ["$$status", [1, 2]] },
                    ],
                  },
                },
              },
            ],
            as: "user",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
            },
          },
        },

        {
          $project: {
            first_name: 1,
            last_name: 1,
            thumb_image: 1,
            client_name: 1,
            project_name: 1,
            video_url: 1,
            project_type: 1,
            genre: 1,
            tags: 1,
            industry: 1,
            freelancer_type: 1,
            status: 1,
            _id: 1,
            user_id: 1,
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.json({
            status: 0,
            message: "Something went wrong.",
            statuscode: 400,
            response: "",
          });
          return;
        } else {
          let total = result.length;
          let response = {
            totalCount: total,
            perPage: perPage,
            pagelimit: perPage,
            totalPages: Math.ceil(total / perPage),
            current: +pageNumber,
          };
          response.terms = result.slice(
            (+pageNumber - 1) * perPage,
            (+pageNumber - 1) * perPage + perPage
          );
          res.json({
            status: 1,
            message: "successfully",
            statuscode: 200,
            response: response,
          });
          return;
        }
      }
    );
  });
};
const portfolioRemove = function (req, res) {
  //console.log(req);
  var Id = req.params.id;
  PortFolios.findOne({ _id: ObjectId(Id) }, function (err, result) {
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
        message: "Portfolio not found.",
        statuscode: 400,
        response: "",
      });
      return;
    } else {
      result.remove(function (err, user) {
        if (err) {
          res.json({
            status: 0,
            message: "Something went wrong",
            statuscode: 400,
            response: "",
          });
          return;
        } else {
          res.json({
            status: 1,
            message: "Portfolio deleted successfully.",
            statuscode: 200,
            response: "",
          });
          return;
        }
      });
    }
  });
};

const portfolioView = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    PortFolios.aggregate(
      [
        { $match: { _id: ObjectId(req.params.id), status: { $in: [1, 2] } } },
        {
          $lookup: {
            from: "users",
            let: { user_id: "$user_id", id: "$_id", status: "$status" },
            pipeline: [
              {
                $match: {
                  $and: [{ $expr: { $eq: ["$_id", "$$user_id"] } }],
                },
              },
            ],
            as: "user",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
            },
          },
        },
        {
          $project: {
            first_name: 1,
            last_name: 1,
            thumb_image: 1,
            client_name: 1,
            project_name: 1,
            video_url: 1,
            project_type: 1,
            genre: 1,
            tags: 1,
            industry: 1,
            freelancer_type: 1,
            status: 1,
            _id: 1,
            user_id: 1,
          },
        },
      ],
      function (err, portfolio) {
        if (err) {
          console.log(err);
          res.json({
            status: 0,
            message: "Something went wrong",
            statuscode: 400,
            response: "",
          });
          return;
        } else if (portfolio) {
          console.log(portfolio);
          portfolio = portfolio[0];
          res.json({
            status: 1,
            message: "data found",
            statuscode: 200,
            response: portfolio,
          });
          return;
        } else {
          res.json({
            status: 0,
            message: "No data found",
            statuscode: 400,
            response: "",
          });
          return;
        }
      }
    );
  });
};

const portfolioUpdate = function (req, res) {
  var form = new formidable.IncomingForm({
    multiples: true,
  });
  form.uploadDir = __dirname + "/../../public/uploads/portfolios/";
  form.parse(req, async function (err, fields, files) {
    console.log("files=>", files);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong.",
        statuscode: 400,
        response: "",
      });
      return;
    }
    var v = new Validator();
    v = new Validator(fields, {
      videoUrl: "required",
      thumb_image: "required",
      tags: "required",
      projectType: "required",
      //genere: 'required',
      user_id: "required",
      //industry: 'required',
      project_name: "required",
      client_name: "required",
    });

    await v.check().then(function (matched) {
      if (!matched) {
        var errors = [];
        if ("videoUrl" in v.errors) {
          errors.push({
            videoUrl: v.errors.videoUrl.message,
          });
        }

        if ("tags" in v.errors) {
          errors.push({
            tags: v.errors.tags.message,
          });
        }
        if ("projectType" in v.errors) {
          errors.push({
            projectType: v.errors.projectType.message,
          });
        }
        if ("genere" in v.errors) {
          errors.push({
            genere: v.errors.genere.message,
          });
        }
        if ("project_name" in v.errors) {
          errors.push({
            project_name: v.errors.project_name.message,
          });
        }
        if ("industry" in v.errors) {
          errors.push({
            industry: v.errors.industry.message,
          });
        }
        if ("client_name" in v.errors) {
          errors.push({
            client_name: v.errors.client_name.message,
          });
        }
        if ("thumb_image" in v.errors) {
          errors.push({
            thumb_image: v.errors.thumb_image.message,
          });
        }
        if ("user_id" in v.errors) {
          errors.push({
            user_id: v.errors.user_id.message,
          });
        }

        // var response = { status: 0, message: 'Title already exists', response: { errors: errors } }
        // res.send(response);
        res.json({
          status: 0,
          message: "Bad request.",
          statuscode: 400,
          response: errors,
        });
        return;
      } else {
        // images from api also contain the base64 data to filter actual image use this script;
        var newImages = fields.updatedImage
          ? JSON.parse(fields.updatedImage)
          : [];
        User.findOne(
          {
            _id: ObjectId(fields.user_id),
            status: 1,
            role: 3,
          },
          async function (err1, user) {
            if (err1) {
              res.json({
                status: 0,
                message: "Something went wrong.",
                statuscode: 400,
                response: "",
              });
              return;
            }
            if (!user) {
              res.json({
                status: 0,
                message: "User data not found.",
                statuscode: 400,
                response: "",
              });
              return;
            } else {
              let fileNames = [];
              PortFolios.findOne(
                {
                  _id: ObjectId(fields.portfolio_id),
                  user_id: ObjectId(fields.user_id),
                },
                function (err1, result) {
                  if (err1) {
                    res.json({
                      status: 0,
                      message: "Something went wrong.",
                      statuscode: 400,
                      response: "",
                    });
                    return;
                  }
                  if (!result) {
                    let portfolio = new PortFolios();
                    portfolio.video_url = fields.videoUrl;
                    portfolio.tags = fields.tags ? JSON.parse(fields.tags) : "";
                    portfolio.project_type = fields.projectType;
                    portfolio.genre = fields.genere;
                    portfolio.industry = fields.industry;
                    portfolio.user_id = fields.user_id;
                    portfolio.client_name = fields.client_name;
                    portfolio.project_name = fields.project_name;
                    portfolio.thumb_image = fields.thumb_image;

                    portfolio.save(function (err, update) {
                      if (err) {
                        res.json({
                          status: 0,
                          message: "Something went wrong",
                          statuscode: 400,
                          response: "",
                        });
                        return;
                      } else if (update) {
                        if (user.current_step <= 5) {
                          user.current_step = 5;
                          user.profile_setup = 1;
                          user.save(function (err, user) {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log(user);
                            }
                          });
                        }

                        res.json({
                          status: 1,
                          message: "Profile updated successfully.",
                          statuscode: 200,
                          response: update,
                        });
                        return;
                      } else {
                        res.json({
                          status: 0,
                          message: "Profile not updated successfully.",
                          statuscode: 400,
                          response: "",
                        });
                        return;
                      }
                    });
                  } else {
                    result.video_url = fields.videoUrl;
                    result.tags = fields.tags ? JSON.parse(fields.tags) : "";
                    result.project_type = fields.projectType;
                    result.genre = fields.genere;
                    result.industry = fields.industry;
                    result.user_id = fields.user_id;
                    result.client_name = fields.client_name;
                    result.project_name = fields.project_name;
                    result.thumb_image = fields.thumb_image;

                    result.save(function (err, update) {
                      if (err) {
                        res.json({
                          status: 0,
                          message: "Something went wrong",
                          statuscode: 400,
                          response: "",
                        });
                        return;
                      } else if (update) {
                        if (user.current_step <= 5) {
                          user.current_step = 5;
                          user.profile_setup = 1;
                          user.save(function (err, user) {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log(user);
                            }
                          });
                        }

                        res.json({
                          status: 1,
                          message: "Portfolio updated successfully.",
                          statuscode: 200,
                          response: update,
                        });
                        return;
                      } else {
                        res.json({
                          status: 0,
                          message: "portfolio not updated successfully.",
                          statuscode: 400,
                          response: "",
                        });
                        return;
                      }
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  });
};

const portfolioChangeStatus = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
      return;
    }
    PortFolios.findOne({ _id: fields.id }, function (err, result) {
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
          message: "Portfolio not found.",
          statuscode: 400,
          response: "",
        });
        return;
      } else {
        result.status = fields.status;
        result.save(function (err, user) {
          if (err) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: "",
            });
            return;
          } else {
            res.json({
              status: 1,
              message: "Status updated successfully.",
              statuscode: 200,
              response: "",
            });
            return;
          }
        });
      }
    });
    //}
  });
};

module.exports = {
  create,
  update,
  index,
  remove,
  changeStatus,
  view,
  approve,
  portfolioIndex,
  portfolioView,
  portfolioRemove,
  portfolioUpdate,
  portfolioChangeStatus,
};
