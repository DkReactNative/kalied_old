const User = require("./../../model/usersModel");
const Skills = require("./../../model/skills&AwardModel");
const PreviousClient = require("./../../model/previousClientModel");
const Expertise = require("./../../model/expertise&priceModel");
const Recommendation = require("./../../model/recommendationsModel");
const PortFolios = require("./../../model/portFoliosModel");
const FavouriteList = require("./../../model/favouriteListModel");
const FavourateUser = require("./../../model/favourateUserModel");
const HiddenList = require("./../../model/hiddenListModel");
const Note = require("./../../model/notesModel");

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

const index = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log("project details fields: ", fields);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong",
        statuscode: 400,
        response: "",
      });
      return;
    }

    if (!fields.freelancer_type || fields.freelancer_type == "") {
      res.json({
        status: 0,
        message: "Bad request.",
        statuscode: 400,
        response: "",
      });
      return;
    }

    // here mongo query intialize  we use it for dynamically
    var mongoQuery = [];
    var isGeoFilter = false;
    // here dynamic filter start
    var filter = [];
    // filters for skills
    if (
      fields.primarySkill &&
      fields.primarySkill != "" &&
      fields.primarySkill.length > 0
    ) {
      filter = [
        ...filter,
        ...[
          {
            "skills.primary_skills": {
              $all: JSON.parse(fields.primarySkill).map((ele) => ObjectId(ele)),
            },
          },
        ],
      ];
    }
    if (
      fields.secondarySkill &&
      fields.secondarySkill != "" &&
      fields.secondarySkill.length > 0
    ) {
      filter = [
        ...filter,
        ...[
          {
            "skills.secondary_skills": {
              $all: JSON.parse(fields.secondarySkill).map((ele) =>
                ObjectId(ele)
              ),
            },
          },
        ],
      ];
    }
    if (
      fields.graphic_speacialities &&
      fields.graphic_speacialities != "" &&
      fields.graphic_speacialities.length > 0
    ) {
      filter = [
        ...filter,
        ...[
          {
            "skills.graphic_specialities": {
              $all: JSON.parse(fields.graphic_speacialities).map((ele) =>
                ObjectId(ele)
              ),
            },
          },
        ],
      ];
    }
    if (
      fields.editing_style &&
      fields.editing_style != "" &&
      fields.editing_style.length > 0
    ) {
      filter = [
        ...filter,
        ...[
          {
            "skills.editing_style": {
              $all: JSON.parse(fields.editing_style).map((ele) =>
                ObjectId(ele)
              ),
            },
          },
        ],
      ];
    }
    if (fields.awards && fields.awards != "" && fields.awards.length > 0) {
      filter = [
        ...filter,
        ...[
          {
            "skills.awards": {
              $all: JSON.parse(fields.awards).map((ele) => ObjectId(ele)),
            },
          },
        ],
      ];
    }

    // portfolio filter
    if (
      fields.project_type &&
      fields.project_type != "" &&
      fields.project_type.length > 0
    ) {
      filter = [
        ...filter,
        ...[
          {
            "portfolios.project_type": {
              $in: JSON.parse(fields.project_type).map((ele) => ObjectId(ele)),
            },
          },
        ],
      ];
    }
    if (
      fields.industry &&
      fields.industry != "" &&
      fields.industry.length > 0
    ) {
      filter = [
        ...filter,
        ...[
          {
            "portfolios.industry": {
              $in: JSON.parse(fields.industry).map((ele) => ObjectId(ele)),
            },
          },
        ],
      ];
    }
    if (fields.genre && fields.genre != "" && fields.genre.length > 0) {
      filter = [
        ...filter,
        ...[
          {
            "portfolios.genre": {
              $in: JSON.parse(fields.genre).map((ele) => ObjectId(ele)),
            },
          },
        ],
      ];
    }

    // expertiselevels filter
    if (
      fields.hourly_rate &&
      fields.hourly_rate != "" &&
      fields.hourly_rate.length > 0
    ) {
      var hourly_rate = JSON.parse(fields.hourly_rate);
      filter = [
        ...filter,
        ...[
          {
            "expertiselevels.hourly_rate": {
              $gte: hourly_rate[0] ? hourly_rate[0] : 0,
              $lte: hourly_rate[1] ? hourly_rate[1] : 100,
            },
          },
        ],
      ];
    }
    if (
      fields.experience_level &&
      fields.experience_level != "" &&
      fields.experience_level.length > 0
    ) {
      filter = [
        ...filter,
        ...[
          {
            "expertiselevels.experience_level": {
              $in: JSON.parse(fields.experience_level),
            },
          },
        ],
      ];
    }

    if (fields.keyword && fields.keyword != "" && fields.keyword != undefined) {
      var search = fields.keyword;
      filter = [
        ...filter,
        ...[
          {
            $or: [
              { first_name: { $regex: search, $options: "i" } },
              { last_name: { $regex: search, $options: "i" } },
              { aboutme: { $regex: search, $options: "i" } },
              { "portfolios.tags": { $all: [search] } },
              {
                "pastClient.client_name": {
                  $regex: search,
                  $options: "i",
                },
              },
            ],
          },
        ],
      ];
    }

    if (
      fields.pastClient_id &&
      fields.pastClientName &&
      fields.pastClient_id != "" &&
      fields.pastClientName != ""
    ) {
      let pastClient_id = JSON.parse(fields.pastClient_id).map((ele) => {
        return ObjectId(ele);
      });
      filter = [
        ...filter,
        ...[
          {
            $or: [
              { "pastClient._id": { $in: [pastClient_id] } },
              {
                "pastClient.client_name": {
                  $regex: fields.pastClientName,
                  $options: "i",
                },
              },
            ],
          },
        ],
      ];
    }

    // if (
    //   fields.address &&
    //   fields.city &&
    //   fields.address != "" &&
    //   fields.city != ""
    // ) {
    //   filter = [
    //     ...filter,
    //     ...[
    //       {
    //         $or: [
    //           { address: { $regex: fields.address, $options: "i" } },
    //           { city: { $regex: fields.city, $options: "i" } },
    //         ],
    //       },
    //     ],
    //   ];
    // }

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
        //maxDistance: 10000,
        spherical: true,
      };
      filter = [
        ...filter,
        ...[{ $expr: { $gte: ["$travel_distance", "$distance"] } }],
      ];

      mongoQuery = [
        ...mongoQuery,
        ...[
          {
            $geoNear: geoJson,
          },
        ],
      ];
    }

    if (fields.user_id != "") {
      filter = [
        ...filter,
        ...[
          {
            "hiddenlists.user_id": { $ne: ObjectId(fields.user_id) },
          },
        ],
      ];
    }

    // sorting object

    var sorting = {};

    if (fields.ethnicity && fields.ethnicity != "") {
      let ethnicity = JSON.parse(fields.ethnicity);
      console.log(ethnicity);
      for (let i = 1; i < 6; i++) {
        if (ethnicity.includes(i + "")) {
          sorting["ethnicitySort" + i] = -1;
        }
      }
    }

    if (fields.gender && fields.gender != "") {
      sorting["gender"] = +fields.gender;
    }

    if (fields.orientation && fields.orientation != "") {
      sorting["orientation"] = +fields.orientation;
    }

    if (fields.disabilities && fields.disabilities != "") {
      sorting["disabilities"] = +fields.disabilities;
    }

    sorting["created_at"] = -1;

    // console.log(sorting);

    var perPage = 10;
    var pageNumber = fields.page ? fields.page : 1;

    var aggregationStage = [
      {
        $match: {
          role: 3,
          freelancer_type: +fields.freelancer_type,
          status: 1,
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "hiddenlists",
          foreignField: "freelancer_id",
          as: "hiddenlists",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "skills",
          foreignField: "user_id",
          as: "skills",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "expertiselevels",
          foreignField: "user_id",
          as: "expertiselevels",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "previouclients",
          foreignField: "user_id",
          as: "pastClient",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "portfolios",
          foreignField: "user_id",
          as: "portfolios",
        },
      },
      {
        $lookup: {
          localField: "_id",
          from: "recommendations",
          foreignField: "user_id",
          as: "recommendations",
        },
      },
      {
        $lookup: {
          from: "favourateusers",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $and: [
                  { $expr: { $eq: ["$user_id", ObjectId(fields.user_id)] } },
                  { $expr: { $eq: ["$freelancer_id", "$$id"] } },
                ],
              },
            },
          ],
          as: "favourate",
        },
      },
      {
        $lookup: {
          from: "notes",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $and: [
                  { $expr: { $eq: ["$user_id", ObjectId(fields.user_id)] } },
                  { $expr: { $eq: ["$freelancer_id", "$$id"] } },
                ],
              },
            },
          ],
          as: "freelancer_note",
        },
      },
      {
        $match: {
          $and: filter,
        },
      },
    ];

    var countQuery = [...aggregationStage, ...[{ $count: "total" }]];
    mongoQuery = [
      ...mongoQuery,
      ...aggregationStage,
      ...(!isGeoFilter
        ? [{ $skip: (+pageNumber - 1) * perPage }, { $limit: perPage }]
        : []),
      ...[
        {
          $project: {
            ethnicitySort1: { $in: ["1", "$ethnicity"] },
            ethnicitySort2: { $in: ["2", "$ethnicity"] },
            ethnicitySort3: { $in: ["3", "$ethnicity"] },
            ethnicitySort4: { $in: ["4", "$ethnicity"] },
            ethnicitySort5: { $in: ["5", "$ethnicity"] },
            first_name: 1,
            image: 1,
            last_name: 1,
            email: 1,
            phoneno: 1,
            role: 1,
            freelancer_type: 1,
            address: 1,
            city: 1,
            state: 1,
            country: 1,
            zipcode: 1,
            latitude: 1,
            longitude: 1,
            aboutme: 1,
            english_proficiency: 1,
            gender: 1,
            ethnicity: 1,
            orientation: 1,
            disabilities: 1,
            availability: 1,
            portfolios: 1,
            pastClient: 1,
            expertiselevels: 1,
            skills: 1,
            recommendations: 1,
            hiddenlists: 1,
            favourate: 1,
            freelancer_note: 1,
            distance: 1,
            travel_distance: 1,
          },
        },
        { $sort: sorting },
        {
          $project: {
            ethnicitySort1: 0,
            ethnicitySort2: 0,
            ethnicitySort3: 0,
            ethnicitySort4: 0,
            ethnicitySort5: 0,
          },
        },
      ],
    ];

    if (!isGeoFilter) {
      mongoQuery = [
        {
          $facet: {
            count: countQuery,
            data: mongoQuery,
          },
        },
      ];
    }

    console.log(JSON.stringify(mongoQuery));

    User.aggregate(mongoQuery, function (err, result) {
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
        let total = isGeoFilter
          ? result.length
          : result[0].count[0]
          ? result[0].count[0].total
          : 0;
        let response = {
          totalCount: total,
          perPage: perPage,
          totalPages: Math.ceil(total / perPage),
          currentPage: +pageNumber,
          portfolio_image_path: appConfig.uploadUrl + "portfolios/",
          profile_image_path: appConfig.uploadUrl + "user/",
          records: isGeoFilter
            ? result.slice(
                (+pageNumber - 1) * perPage,
                (+pageNumber - 1) * perPage + perPage
              )
            : result[0].data,
        };
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
};

const favouriteTabIndex = function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields) {
    var filter = { user_id: ObjectId(fields.user_id), status: 1 };
    if (fields.keyword && fields.keyword != "") {
      filter["name"] = { $regex: fields.keyword, $options: "i" };
    }
    FavouriteList.find(filter, function (err, result) {
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
          message: "List not found.",
          statuscode: 400,
          response: "",
        });
        return;
      } else {
        result = JSON.parse(JSON.stringify(result));

        result = result.map((ele) => {
          if (ele.image)
            ele.image = appConfig.uploadUrl + "favouriteTabs/" + ele.image;
          return ele;
        });

        res.json({
          status: 1,
          message: "",
          statuscode: 200,
          response: result,
        });
        return;
      }
    });
  });
};

const favourateAddUser = function (req, res) {
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/../../public/uploads/favouriteTabs/";
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
    var v = new Validator(fields, {
      notes: "required",
      user_id: "required",
      freelancer_id: "required",
      list_id: "required",
    });

    await v.check().then(function (matched) {
      if (!matched) {
        var errors = [];
        if ("notes" in v.errors) {
          errors.push({
            notes: v.errors.notes.message,
          });
        }
        if ("user_id" in v.errors) {
          errors.push({
            user_id: v.errors.user_id.message,
          });
        }
        if ("list_id" in v.errors) {
          errors.push({
            list_id: v.errors.list_id.message,
          });
        }
        if ("freelancer_id" in v.errors) {
          errors.push({
            freelancer_id: v.errors.freelancer_id.message,
          });
        }
        res.json({
          status: 0,
          message: "Bad request.",
          statuscode: 400,
          response: errors,
        });
        return;
      } else {
        if (fields.list_id && fields.list_id != "") {
          User.findOne(
            {
              _id: ObjectId(fields.user_id),
              status: 1,
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
                res.json({
                  status: 0,
                  message: "User data not found.",
                  statuscode: 400,
                  response: "",
                });
                return;
              } else {
                FavouriteList.findOne(
                  {
                    _id: ObjectId(fields.list_id),
                    status: 1,
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
                    if (result) {
                      FavourateUser.findOne(
                        {
                          list_id: ObjectId(fields.list_id),
                          user_id: ObjectId(fields.user_id),
                          freelancer_id: ObjectId(fields.freelancer_id),
                        },
                        function (err1, favouriteData) {
                          if (err1) {
                            res.json({
                              status: 0,
                              message: "Something went wrong.",
                              statuscode: 400,
                              response: "",
                            });
                            return;
                          }
                          if (!favouriteData) {
                            let updateObject = new FavourateUser();
                            updateObject.note = fields.notes;
                            updateObject.list_id = fields.list_id;
                            updateObject.freelancer_id = fields.freelancer_id;
                            updateObject.user_id = fields.user_id;
                            console.log(updateObject);
                            updateObject.save(function (err2, user) {
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
                                res.json({
                                  status: 1,
                                  message: "Insert successfully.",
                                  statuscode: 200,
                                  response: user,
                                });
                                return;
                              } else {
                                res.json({
                                  status: 0,
                                  message: "insert failed.",
                                  statuscode: 400,
                                  response: user,
                                });
                                return;
                              }
                            });
                          } else {
                            res.json({
                              status: 0,
                              message: "Freelancer already added in list.",
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
                        message: "List data not found.",
                        statuscode: 400,
                        response: "",
                      });
                      return;
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  });
};

const favourateListAdd = function (req, res) {
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/../../public/uploads/favouriteTabs/";
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
    var v = new Validator(fields, {
      name: "required",
      user_id: "required",
    });

    await v.check().then(function (matched) {
      if (!matched) {
        var errors = [];
        if ("name" in v.errors) {
          errors.push({
            name: v.errors.name.message,
          });
        }
        if ("user_id" in v.errors) {
          errors.push({
            user_id: v.errors.user_id.message,
          });
        }
        res.json({
          status: 0,
          message: "Bad request.",
          statuscode: 400,
          response: errors,
        });
        return;
      } else {
        let fileName = "";
        if (files.image && files.image.name) {
          fileName = new Date().getTime() + files.image.name.replace(" ", "-");
          var oldpath = files.image.path;
          var newpath =
            __dirname + "/../../public/uploads/favouriteTabs/" + fileName;
          fs.rename(oldpath, newpath, function (err) {
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

        User.findOne({ _id: ObjectId(fields.user_id), status: 1 }, function (
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
            FavouriteList.findOne({ name: fields.name }, function (err, list) {
              if (err) {
                res.json({
                  status: 0,
                  message: "Something went wrong.",
                  statuscode: 400,
                  response: "",
                });
                return;
              } else if (list) {
                res.json({
                  status: 0,
                  message: "List already created for same name.",
                  statuscode: 400,
                  response: "",
                });
                return;
              } else {
                let updateObject = new FavouriteList();
                updateObject.name = fields.name;
                updateObject.image = fileName;
                updateObject.user_id = fields.user_id;

                console.log(result);
                updateObject.save(function (err2, user) {
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
                    user.image = user.image
                      ? appConfig.uploadUrl + "favouriteTabs/" + user.image
                      : "";
                    res.json({
                      status: 1,
                      message: "List created successfully.",
                      statuscode: 200,
                      response: user,
                    });
                    return;
                  } else {
                    res.json({
                      status: 0,
                      message: "List not created successfully.",
                      statuscode: 400,
                      response: user,
                    });
                    return;
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

const favourateUser = function (req, res) {
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "/../../public/uploads/favouriteTabs/";

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
    } else {
      var filter = [];
      filter = [...filter, ...[{ "user.status": 1 }]];
      if (
        fields.keyword &&
        fields.keyword != "" &&
        fields.keyword != undefined
      ) {
        var search = fields.keyword;
        filter = [
          ...filter,
          ...[
            {
              $or: [
                { "user.first_name": { $regex: search, $options: "i" } },
                { "user.last_name": { $regex: search, $options: "i" } },
                { "user.aboutme": { $regex: search, $options: "i" } },
                { "portfolios.tags": { $all: [search] } },
              ],
            },
          ],
        ];
      }

      if (fields.user_id != "") {
        filter = [
          ...filter,
          ...[
            {
              "hiddenlists.user_id": { $ne: ObjectId(fields.user_id) },
            },
          ],
        ];
      }
      var perPage = 5;
      var pageNumber = fields.page ? fields.page : 1;
      FavourateUser.aggregate(
        [
          {
            $match: {
              list_id: ObjectId(fields.list_id),
              user_id: ObjectId(fields.user_id),
            },
          },
          {
            $lookup: {
              localField: "_id",
              from: "hiddenlists",
              foreignField: "freelancer_id",
              as: "hiddenlists",
            },
          },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "users",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "skills",
              foreignField: "user_id",
              as: "skills",
            },
          },

          {
            $lookup: {
              localField: "freelancer_id",
              from: "expertiselevels",
              foreignField: "user_id",
              as: "expertiselevels",
            },
          },

          {
            $lookup: {
              localField: "freelancer_id",
              from: "previouclients",
              foreignField: "user_id",
              as: "pastClient",
            },
          },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "portfolios",
              foreignField: "user_id",
              as: "portfolios",
            },
          },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "recommendations",
              foreignField: "user_id",
              as: "recommendations",
            },
          },
          {
            $match: { $and: filter },
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
              freelancer_id: 1,
              note: 1,
              first_name: 1,
              last_name: 1,
              email: 1,
              phoneno: 1,
              role: 1,
              freelancer_type: 1,
              address: 1,
              city: 1,
              state: 1,
              country: 1,
              zipcode: 1,
              latitude: 1,
              longitude: 1,
              aboutme: 1,
              english_proficiency: 1,
              gender: 1,
              ethnicity: 1,
              orientation: 1,
              disabilities: 1,
              availability: 1,
              portfolios: 1,
              pastClient: 1,
              expertiselevels: 1,
              skills: 1,
              recommendations: 1,
            },
          },
        ],
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
              message: "List not found.",
              statuscode: 400,
              response: "",
            });
            return;
          } else {
            let total = result.length;
            response = {
              totalCount: total,
              perPage: perPage,
              totalPages: Math.ceil(total / perPage),
              currentPage: +pageNumber,
              portfolio_image_path: appConfig.uploadUrl + "portfolios/",
              profile_image_path: appConfig.uploadUrl + "user/",
            };
            response.records = result.slice(
              (+pageNumber - 1) * perPage,
              (+pageNumber - 1) * perPage + perPage
            );
            res.json({
              status: 1,
              message: "data found!.",
              statuscode: 200,
              response: response,
            });
            return;
          }
        }
      );
    }
  });
};

const hiddenListAdd = function (req, res) {
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
      return;
    }
    var v = new Validator(fields, {
      freelancer_id: "required",
      user_id: "required",
    });

    await v.check().then(function (matched) {
      if (!matched) {
        var errors = [];
        if ("freelancer_id" in v.errors) {
          errors.push({
            freelancer_id: v.errors.freelancer_id.message,
          });
        }
        if ("user_id" in v.errors) {
          errors.push({
            user_id: v.errors.user_id.message,
          });
        }
        res.json({
          status: 0,
          message: "Bad request.",
          statuscode: 400,
          response: errors,
        });
        return;
      } else {
        User.findOne({ _id: ObjectId(fields.user_id), status: 1 }, function (
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
            HiddenList.findOne(
              {
                user_id: ObjectId(fields.user_id),
                freelancer_id: fields.freelancer_id,
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
                if (result) {
                  res.json({
                    status: 0,
                    message: "Freelancer already added in hidden list.",
                    statuscode: 400,
                    response: "",
                  });
                  return;
                } else {
                  let updateObject = new HiddenList();
                  updateObject.freelancer_id = fields.freelancer_id;
                  updateObject.user_id = fields.user_id;

                  console.log(result);
                  updateObject.save(function (err2, user) {
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
                      res.json({
                        status: 1,
                        message: "List created successfully.",
                        statuscode: 200,
                        response: user,
                      });
                      return;
                    } else {
                      res.json({
                        status: 0,
                        message: "List not created successfully.",
                        statuscode: 400,
                        response: user,
                      });
                      return;
                    }
                  });
                }
              }
            );
          }
        });
      }
    });
  });
};

const hidenListIndex = function (req, res) {
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    var filter = [];
    filter = [...filter, ...[{ "user.status": 1 }]];
    if (fields.keyword && fields.keyword != "" && fields.keyword != undefined) {
      var search = fields.keyword;
      filter = [
        ...filter,
        ...[
          {
            $or: [
              { "user.first_name": { $regex: search, $options: "i" } },
              { "user.last_name": { $regex: search, $options: "i" } },
              { "user.aboutme": { $regex: search, $options: "i" } },
              { "portfolios.tags": { $all: [search] } },
            ],
          },
        ],
      ];
    }
    console.log(fields);
    if (err) {
      res.json({
        status: 0,
        message: "Something went wrong.",
        statuscode: 400,
        response: "",
      });
      return;
    } else {
      var perPage = 5;
      var pageNumber = fields.page ? fields.page : 1;
      HiddenList.aggregate(
        [
          { $match: { user_id: ObjectId(fields.user_id) } },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "users",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "skills",
              foreignField: "user_id",
              as: "skills",
            },
          },

          {
            $lookup: {
              localField: "freelancer_id",
              from: "expertiselevels",
              foreignField: "user_id",
              as: "expertiselevels",
            },
          },

          {
            $lookup: {
              localField: "freelancer_id",
              from: "previouclients",
              foreignField: "user_id",
              as: "pastClient",
            },
          },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "portfolios",
              foreignField: "user_id",
              as: "portfolios",
            },
          },
          {
            $lookup: {
              localField: "freelancer_id",
              from: "recommendations",
              foreignField: "user_id",
              as: "recommendations",
            },
          },
          {
            $lookup: {
              from: "favourateusers",
              let: { freelancer_id: "$freelancer_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$user_id", fields.user_id] },
                        { $eq: ["$freelancer_id", "$$freelancer_id"] },
                      ],
                    },
                  },
                },
              ],
              as: "favourate",
            },
          },
          {
            $lookup: {
              from: "notes",
              let: { freelancer_id: "$freelancer_id" },
              pipeline: [
                {
                  $match: {
                    $and: [
                      {
                        $expr: { $eq: ["$user_id", ObjectId(fields.user_id)] },
                      },
                      { $expr: { $eq: ["$freelancer_id", "$$freelancer_id"] } },
                    ],
                  },
                },
              ],
              as: "freelancer_note",
            },
          },
          {
            $match: { $and: filter },
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
              freelancer_id: 1,
              favourite_list: {
                $cond: {
                  if: { $arrayElemAt: ["$favourate", 0] },
                  then: { $arrayElemAt: ["$favourate", 0] },
                  else: {},
                },
              },
              first_name: 1,
              last_name: 1,
              email: 1,
              phoneno: 1,
              role: 1,
              freelancer_type: 1,
              address: 1,
              city: 1,
              state: 1,
              country: 1,
              zipcode: 1,
              latitude: 1,
              longitude: 1,
              aboutme: 1,
              english_proficiency: 1,
              gender: 1,
              ethnicity: 1,
              orientation: 1,
              disabilities: 1,
              availability: 1,
              portfolios: 1,
              pastClient: 1,
              expertiselevels: 1,
              skills: 1,
              recommendations: 1,
              freelancer_note: 1,
            },
          },
        ],
        function (err, result) {
          if (err) {
            res.json({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: "",
            });
            console.log(err);
            return;
          }
          if (!result) {
            res.json({
              status: 0,
              message: "List not found.",
              statuscode: 400,
              response: "",
            });
            return;
          } else {
            let total = result.length;
            response = {
              totalCount: total,
              perPage: perPage,
              totalPages: Math.ceil(total / perPage),
              currentPage: +pageNumber,
              portfolio_image_path: appConfig.uploadUrl + "portfolios/",
              profile_image_path: appConfig.uploadUrl + "user/",
            };
            response.records = result.slice(
              (+pageNumber - 1) * perPage,
              (+pageNumber - 1) * perPage + perPage
            );
            res.json({
              status: 1,
              message: "",
              statuscode: 200,
              response: response,
            });
            return;
          }
        }
      );
    }
  });
};

const pastClients = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    User.aggregate(
      [
        { $match: { role: 2, status: 1, email_confirmed: 1, approved: 1 } },
        {
          $project: {
            _id: 0,
            value: "$_id",
            name: { $concat: ["$first_name", " ", "$last_name"] },
          },
        },
      ],
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
          result.image = result.image
            ? appConfig.uploadUrl + "user/" + result.image
            : "";
          res.json({
            status: 1,
            message: "",
            statuscode: 200,
            response: result,
          });
          return;
        }
      }
    );
  });
};

const favourateRemoveUser = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    let filter = null;
    if (fields.completeDelete) {
      filter = {
        user_id: ObjectId(fields.user_id),
        freelancer_id: ObjectId(fields.freelancer_id),
      };
    } else {
      filter = {
        user_id: ObjectId(fields.user_id),
        freelancer_id: ObjectId(fields.freelancer_id),
        list_id: ObjectId(fields.list_id),
      };
    }
    FavourateUser.find(filter, function (err, result) {
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
          message: "User not found in list",
          statuscode: 400,
          response: "",
        });
        return;
      } else {
        FavourateUser.remove(filter, function (err, result) {
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
              message: "Something went wrong.",
              statuscode: 400,
              response: "",
            });
            return;
          } else {
            res.json({
              status: 1,
              message: "User removed succesfully from list.",
              statuscode: 200,
              response: result,
            });
            return;
          }
        });
      }
    });
  });
};

const hiddenListRemove = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    HiddenList.findOneAndDelete(
      {
        user_id: ObjectId(fields.user_id),
        freelancer_id: ObjectId(fields.freelancer_id),
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
          console.log(result);
          res.json({
            status: 0,
            message: "User not found in list.",
            statuscode: 400,
            response: "",
          });
          return;
        } else {
          res.json({
            status: 1,
            message: "User removed succesfully from list.",
            statuscode: 200,
            response: result,
          });
          return;
        }
      }
    );
  });
};

const addnote = function (req, res) {
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
    var v = new Validator(fields, {
      freelancer_id: "required",
      user_id: "required",
      note: "required",
    });

    await v.check().then(function (matched) {
      if (!matched) {
        var errors = [];
        if ("freelancer_id" in v.errors) {
          errors.push({
            freelancer_id: v.errors.freelancer_id.message,
          });
        }
        if ("user_id" in v.errors) {
          errors.push({
            user_id: v.errors.user_id.message,
          });
        }
        if ("note" in v.errors) {
          errors.push({
            note: v.errors.note.message,
          });
        }
        res.json({
          status: 0,
          message: "Bad request.",
          statuscode: 400,
          response: errors,
        });
        return;
      } else {
        User.findOne({ _id: ObjectId(fields.user_id), status: 1 }, function (
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
            Note.findOne(
              {
                user_id: ObjectId(fields.user_id),
                freelancer_id: fields.freelancer_id,
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
                if (result) {
                  result.note = fields.note;
                  console.log(result);
                  result.save(function (err2, user) {
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
                      res.json({
                        status: 1,
                        message: "Note save successfully.",
                        statuscode: 200,
                        response: user,
                      });
                      return;
                    } else {
                      res.json({
                        status: 0,
                        message: "Note not save successfully.",
                        statuscode: 400,
                        response: user,
                      });
                      return;
                    }
                  });
                } else {
                  let updateObject = new Note();
                  updateObject.freelancer_id = fields.freelancer_id;
                  updateObject.user_id = fields.user_id;
                  updateObject.note = fields.note;

                  console.log(result);
                  updateObject.save(function (err2, user) {
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
                      res.json({
                        status: 1,
                        message: "Note save successfully.",
                        statuscode: 200,
                        response: user,
                      });
                      return;
                    } else {
                      res.json({
                        status: 0,
                        message: "Note not save successfully.",
                        statuscode: 400,
                        response: user,
                      });
                      return;
                    }
                  });
                }
              }
            );
          }
        });
      }
    });
  });
};

const freelancerProfile = function (req, res) {
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

    // if ((!fields.user_id || fields.user_id == '') && (!fields.freelancer_type || fields.freelancer_type != '')) {

    //     res.json({
    //         status: 0,
    //         message: 'Bad request.',
    //         statuscode: 400,
    //         response: ''
    //     });
    //     return;
    // }

    console.log(req.user);

    let obj = [];

    if (fields.user_id) {
      obj = [
        ...obj,
        ...[{ $expr: { $eq: ["$user_id", ObjectId(fields.user_id)] } }],
      ];
    }

    obj = [
      ...obj,
      ...[{ $expr: { $eq: ["$freelancer_id", "$$freelancer_id"] } }],
    ];

    User.aggregate(
      [
        { $match: { role: 3, status: 1, _id: ObjectId(fields.id) } },
        {
          $lookup: {
            localField: "_id",
            from: "skills",
            foreignField: "user_id",
            as: "skills",
          },
        },

        {
          $lookup: {
            localField: "_id",
            from: "expertiselevels",
            foreignField: "user_id",
            as: "expertiselevels",
          },
        },

        {
          $lookup: {
            localField: "_id",
            from: "previouclients",
            foreignField: "user_id",
            as: "pastClient",
          },
        },
        {
          $lookup: {
            localField: "_id",
            from: "portfolios",
            foreignField: "user_id",
            as: "portfolios",
          },
        },
        {
          $lookup: {
            localField: "_id",
            from: "recommendations",
            foreignField: "user_id",
            as: "recommendations",
          },
        },
        {
          $lookup: {
            from: "notes",
            let: { freelancer_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $and: obj,
                },
              },
            ],
            as: "freelancer_note",
          },
        },
        {
          $project: {
            first_name: 1,
            last_name: 1,
            email: 1,
            phoneno: 1,
            role: 1,
            freelancer_type: 1,
            address: 1,
            city: 1,
            state: 1,
            country: 1,
            zipcode: 1,
            latitude: 1,
            longitude: 1,
            aboutme: 1,
            english_proficiency: 1,
            gender: 1,
            ethnicity: 1,
            orientation: 1,
            disabilities: 1,
            availability: 1,
            portfolios: 1,
            pastClient: 1,
            expertiselevels: 1,
            skills: 1,
            recommendations: 1,
            freelancer_note: 1,
          },
        },
      ],
      function (err, result) {
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
          response = {
            portfolio_image_path: appConfig.uploadUrl + "portfolios/",
            profile_image_path: appConfig.uploadUrl + "user/",
          };
          response.records = result;
          res.json({
            status: 1,
            message: "",
            statuscode: 200,
            response: response,
          });
          return;
        }
      }
    );
  });
};
module.exports = {
  index,
  favouriteTabIndex,
  favourateAddUser,
  favourateListAdd,
  favourateUser,
  hiddenListAdd,
  hidenListIndex,
  pastClients,
  favourateRemoveUser,
  hiddenListRemove,
  addnote,
  freelancerProfile,
};
