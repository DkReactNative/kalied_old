const User = require("../../model/usersModel");
const Skills = require("../../model/skills&AwardModel");
const Project = require("../../model/projectDetailModel");
const Expertise = require("./../../model/expertise&priceModel");
const ProjectCandidate = require("../../model/projectCandidateModel");
const FavourateUser = require("../../model/favourateUserModel");
const Emailtemplates = require("../../model/emailTempleteModel");
const bcrypt = require("bcryptjs");
const adminHelper = require("../../helper/adminHelper");
const isValidId = require("../../helper/validObjectId");
const jwt = require("jsonwebtoken");
const appConfig = require("../../config/app");
const mongoose = require("mongoose");
const formidable = require("formidable");
const mailSend = require("../../helper/mailer");
const ObjectId = mongoose.Types.ObjectId;
const niv = require("node-input-validator");
const { Validator } = niv;
const fs = require("fs");
//const ISODate = mongoose.Types.ISODate;
const moment = require("moment");
const _ = require("lodash");
const { concatSeries, reject } = require("async");
const { resolve } = require("path");
const projectCandidateModel = require("../../model/projectCandidateModel");

const index = function (req, res) {
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
    } else {
      var mongoQuery = [];
      var isGeoFilter = false;
      var perPage = 5;
      var pageNumber = fields.page ? fields.page : 1;
      var filter = { status: 1, project_setup: 1 };
      if (fields.freelancer_type) {
        filter["freelancer_type"] = +fields.freelancer_type;
      }
      if (fields.project_type) {
        filter["project_type"] = ObjectId(fields.project_type);
      }
      if (fields.payment_type) {
        filter["payment_type"] = +fields.payment_type;
        var price_range = JSON.parse(fields.price_range);
        if (fields.payment_type == 2) {
          filter["hourly_rate"] = {
            $gte: price_range[0] ? price_range[0] : 0,
            $lte: price_range[1] ? price_range[1] : 100,
          };
        }
        if (fields.payment_type == 1) {
          filter["fixed_budget.0"] = {
            $gte: price_range[0] ? price_range[0] : 0,
          };

          filter["fixed_budget.1"] = {
            $lte: price_range[1] ? price_range[1] : 10000,
          };
        }
      }
      if (
        (fields.genere && fields.genere != "") ||
        (fields.industry && fields.industry != "")
      ) {
        filter["$and"] = [];
        if (fields.genere) {
          filter["$and"].push({
            $expr: { $in: [ObjectId(fields.genere), "$genere"] },
          });
        }
        if (fields.industry) {
          filter["$and"].push({
            $expr: { $in: [ObjectId(fields.industry), "$industry"] },
          });
        }
      }
      if (fields.keyword && fields.keyword.length > 0) {
        let search = fields.keyword;
        filter["$or"] = [
          { title: { $regex: search, $options: "i" } },
          { style: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      if (fields.mymatch && req.user._id) {
        let isValidUser = isValidId(req.user._id);
        if (isValidUser && req.user.profile_setup) {
          var expetise = await Expertise.findOne({
            user_id: ObjectId(req.user._id),
          });

          filter["$or"] = [];

          filter["$or"].push({ hourly_rate: { $gte: expetise.hourly_rate } });

          filter["$or"].push({
            "fixed_budget.0": {
              $gte: expetise.minimum_fixed_price,
            },
          });
        }
      }
      let geoJson = {
        near: {
          type: "Point",
          coordinates: [0, 0],
        },
        distanceField: "distance",
      };

      if (parseFloat(fields.longitude) && parseFloat(fields.latitude)) {
        isGeoFilter = true;
        geoJson = {
          near: {
            type: "Point",
            coordinates: [
              fields.longitude ? parseFloat(fields.longitude) : 0,
              fields.latitude ? parseFloat(fields.latitude) : 0,
            ],
          },
          distanceField: "distance",
          maxDistance: 10000,
          spherical: true,
        };
        mongoQuery = [
          ...mongoQuery,
          ...[
            {
              $geoNear: geoJson,
            },
          ],
        ];
      }
      mongoQuery = [
        ...mongoQuery,
        ...[
          {
            $match: filter,
          },
        ],
      ];
      console.log(JSON.stringify(mongoQuery));
      Project.aggregate(mongoQuery, (err, result) => {
        if (err) {
          res.json({
            status: 0,
            message: "Something went wrong",
            statuscode: 400,
            response: "",
          });
        } else if (result) {
          let total = result.length;
          let response = {
            totalCount: total,
            perPage: perPage,
            totalPages: Math.ceil(total / perPage),
            currentPage: +pageNumber,
            records: result.slice(
              (+pageNumber - 1) * perPage,
              (+pageNumber - 1) * perPage + perPage
            ),
          };
          res.json({
            status: 1,
            message: "Success",
            statuscode: 200,
            response: response,
          });
        } else {
          res.json({
            status: 0,
            message: "Project data not found",
            statuscode: 400,
            response: {},
          });
        }
      });
    }
  });
};

const projectInfo = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    // console.log('fields');
    console.log(fields);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
      return;
    } else {
      let isValidid = isValidId(req.params.id);
      if (!isValidid) {
        res.json({
          status: 0,
          message: "Wrong project detail provided",
          statuscode: 400,
          response: "",
        });
        return;
      }
      Project.aggregate(
        [
          { $match: { _id: ObjectId(req.params.id), status: { $ne: 0 } } },
          {
            $lookup: {
              from: "primaryskills",
              let: { skills: "$skills" },
              pipeline: [
                {
                  $match: {
                    $and: [{ $expr: { $in: ["$_id", "$$skills"] } }],
                  },
                },
              ],
              as: "skills",
            },
          },
          {
            $lookup: {
              from: "projecttypes",
              let: { project_type: "$project_type" },
              pipeline: [
                {
                  $match: {
                    $and: [{ $expr: { $eq: ["$_id", "$$project_type"] } }],
                  },
                },
              ],
              as: "project_type",
            },
          },
          {
            $lookup: {
              from: "generetypes",
              let: { project_type: "$project_type", genere: "$genere" },
              pipeline: [
                {
                  $match: {
                    $and: [{ $expr: { $in: ["$_id", "$$genere"] } }],
                  },
                },
              ],
              as: "genere",
            },
          },
          {
            $lookup: {
              from: "industrytypes",
              let: { project_type: "$project_type", industry: "$industry" },
              pipeline: [
                {
                  $match: {
                    $and: [{ $expr: { $in: ["$_id", "$$industry"] } }],
                  },
                },
              ],
              as: "industry",
            },
          },
        ],
        (err, data) => {
          if (err) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: "",
            });
          } else if (data) {
            data = JSON.parse(JSON.stringify(data));
            data = data[0] ? data[0] : {};
            if (data.location) {
              data.latitude = data.location.coordinates.latitude;
              data.longitude = data.location.coordinates.longitude;
            }
            data.image_pdf_path = appConfig.uploadUrl + "project/";
            data.project_type =
              data.project_type && data.project_type[0]
                ? data.project_type[0]
                : {};
            res.json({
              status: 1,
              message: "Success",
              statuscode: 200,
              response: data,
            });
          } else {
            res.json({
              status: 0,
              message: "Project data not found",
              statuscode: 400,
              response: "",
            });
          }
        }
      );
    }
  });
};

const submitQuote = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    if (err)
      return res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });

    v = new Validator(fields, {
      message: "required",
      project_id: "required",
      candidate_type: "required",
    });

    await v.check().then(function (matched) {
      if (!matched) {
        var errors = [];
        if ("candidate_type" in v.errors) {
          errors.push({ candidate_type: v.errors.candidate_type.message });
        }
        if ("project_id" in v.errors) {
          errors.push({ project_id: v.errors.project_id.message });
        }
        if ("message" in v.errors) {
          errors.push({ message: v.errors.message.message });
        }
        res.json({
          status: 0,
          message: "Bad request.",
          statuscode: 400,
          response: errors,
        });
      } else {
        let isValidid = isValidId(fields.project_id);
        if (!isValidid) {
          res.json({
            status: 0,
            message: "Wrong project detail provided",
            statuscode: 400,
            response: "",
          });
          return;
        }

        let isValidUser = isValidId(req.user._id);
        if (!isValidUser) {
          res.json({
            status: 0,
            message: "Wrong user detail provided",
            statuscode: 400,
            response: "",
          });
          return;
        }

        User.findOne(
          { _id: Object(req.user._id), status: 1, role: 3 },
          (err, user) => {
            if (err) {
              res.json({
                status: 0,
                message: "Something went wrong",
                statuscode: 400,
                response: "",
              });
              return;
            } else if (user) {
              Project.findOne(
                {
                  _id: Object(fields.project_id),
                  approved: 1,
                  project_setup: 1,
                  status: { $nin: [0, 3, 4, 6, 7] },
                },
                (err, data) => {
                  if (err) {
                    res.json({
                      status: 0,
                      message: "Something went wrong",
                      statuscode: 400,
                      response: "",
                    });
                    return;
                  } else if (data) {
                    if (data.payment_type == 2 && !fields.hourly_rate) {
                      res.json({
                        status: 0,
                        message: "Hourly rate required",
                        statuscode: 400,
                        response: "",
                      });
                      return;
                    }
                    if (data.payment_type == 1 && !fields.fixed_amount) {
                      res.json({
                        status: 0,
                        message: "Fixed amount required",
                        statuscode: 400,
                        response: "",
                      });
                      return;
                    }
                    var updateQuery = {
                      $set: {
                        freelancer_id: ObjectId(req.user._id),
                        user_id: ObjectId(data.user_id),
                        project_id: ObjectId(fields.project_id),
                        candidate_type: +fields.candidate_type,
                        message: fields.message,
                        hourly_rate:
                          data.payment_type == 2 && fields.hourly_rate
                            ? parseFloat(fields.hourly_rate)
                            : 0,
                        weekly_limit:
                          data.payment_type == 2 && fields.weekly_limit
                            ? parseFloat(fields.weekly_limit)
                            : 0,
                        fixed_amount:
                          data.payment_type == 1 && fields.fixed_amount
                            ? parseFloat(fields.fixed_amount)
                            : 0,
                        total_hours:
                          data.payment_type == 2 && fields.total_hours
                            ? parseFloat(fields.total_hours)
                            : 0,
                      },
                    };

                    if (data.status && data.status == 1) {
                      projectCandidateModel.findOneAndUpdate(
                        {
                          freelancer_id: ObjectId(req.user._id),
                          user_id: ObjectId(data.user_id),
                          project_id: ObjectId(fields.project_id),
                        },
                        updateQuery,
                        { upsert: true, new: true },
                        function (err, doc) {
                          if (err) {
                            console.log(err);
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
                              message:
                                "Your quotation successfully submitted for this project",
                              statuscode: 200,
                              response: doc,
                            });
                            return;
                          }
                        }
                      );
                    } else {
                      res.json({
                        status: 0,
                        message: "Project already booked",
                        statuscode: 400,
                        response: "",
                      });
                      return;
                    }
                  } else {
                    res.json({
                      status: 0,
                      message: "Project does not exists",
                      statuscode: 400,
                      response: "",
                    });
                    return;
                  }
                }
              );
            } else {
              res.json({
                status: 0,
                message: "Invalid user",
                statuscode: 400,
                response: "",
              });
              return;
            }
          }
        );
      }
    });
  });
};

module.exports = {
  index,
  projectInfo,
  submitQuote,
};
