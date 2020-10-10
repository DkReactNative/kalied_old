const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Myfunction = require("../../helper/myfunctions");
const formidable = require("formidable");
const projecttype = require("../../model/projectTypeModel");
const Project = require("../../model/projectDetailModel");
// const  compareSync  = require("bcrypt-nodejs");
const moment = require("moment");

const list = async (req, res) => {
  var form = new formidable.IncomingForm();
  let project_type = await projecttype.find().select({ _id: 1, name: 1 });
  let type = {};
  let total = 0;
  var pageNumber = req.params.page ? req.params.page : 1;
  var perPage = 10;
  project_type.map((ele) => {
    type[ele._id] = ele.name;
  });
  form.parse(req, async (err, fields) => {
    var filter = [];
    if (err) {
      return res.send(Myfunction.failResponse("Something went wrong", err));
    }
    if (fields.keyword && fields.keyword != "" && fields.keyword != undefined) {
      var search = fields.keyword;
      filter = [
        ...filter,
        ...[
          {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { "User.first_name": { $regex: search, $options: "i" } },
              { "User.last_name": { $regex: search, $options: "i" } },
            ],
          },
        ],
      ];
    }
    if (fields.project_type && fields.project_type != "") {
      var project_type = fields.project_type;
      filter = [
        ...filter,
        ...[
          {
            project_type: ObjectId(project_type),
          },
        ],
      ];
    }

    filter.push({ status: { $in: [0, 1] } });
    // console.log("filter", filter);

    if (fields.page) {
      pageNumber = fields.page;
    }

    Project.aggregate(
      [
        { $match: { $and: filter } },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "User",
          },
        },

        {
          $project: {
            _id: 1,
            status: 1,
            approved: 1,
            project_setup: 1,
            current_step: 1,
            created: 1,
            title: 1,
            description: 1,
            user_id: 1,
            style: 1,
            background: 1,
            city: 1,
            country: 1,
            freelancer_type: 1,
            project_type: 1,
            state: 1,
            zipcode: 1,
            end_date: 1,
            hourly_rate: 1,
            payment_type: {
              $cond: {
                if: { $eq: ["$payment_type", 1] },
                then: "Fixed Budget",
                else: "Hourly Payment",
              },
            },
            start_date: 1,
            User: { $arrayElemAt: ["$User", 0] },
          },
        },
        {
          $facet: {
            filterData: [{ $count: "total" }],
            data: [{ $skip: (+pageNumber - 1) * perPage }, { $limit: perPage }],
          },
        },
      ],

      async (err, result) => {
        if (err) {
          return res.send(Myfunction.failResponse("Something went wrong", err));
        }
        if (result.length > 0 && result[0].data.length == 0) {
          total =
            result[0].filterData.length > 0
              ? result[0].filterData[0].total
              : total;
          let response = {
            totalCount: total,
            perPage: perPage,
            pagelimit: perPage,
            totalPages: Math.ceil(total / perPage),
            current: +pageNumber,
            project_type: type,
          };

          return res.send(
            Myfunction.successResponse("Project Not Found", response)
          );
        } else {
          total =
            result[0].filterData.length > 0
              ? result[0].filterData[0].total
              : total;
          let response = {
            totalCount: total,
            perPage: perPage,
            pagelimit: perPage,
            totalPages: Math.ceil(total / perPage),
            current: +pageNumber,
          };
          response.result = result[0].data;
          response.project_type = type;
          return res.send(Myfunction.successResponse("Successfully", response));
        }
      }
    );
  });
};

const view = (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    console.log("api called: ", req.params.id);
    Project.aggregate(
      [
        {
          $match: {
            _id: ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: "generetypes",
            let: { gid: "$genere" },
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
                    $in: ["$_id", "$$gid"],
                  },
                },
              },
            ],
            as: "genere_data",
          },
        },
        {
          $lookup: {
            from: "industrytypes",
            let: { iid: "$industry" },
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
                    $in: ["$_id", "$$iid"],
                  },
                },
              },
            ],
            as: "industry_data",
          },
        },
        {
          $lookup: {
            from: "primaryskills",
            let: { sid: "$skills" },
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
                    $in: ["$_id", "$$sid"],
                  },
                },
              },
            ],
            as: "skill_data",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $project: {
            _id: 1,
            skill_data: 1,
            industry_data: 1,
            genere_data: 1,
            images: 1,
            files: 1,
            fixed_budget: 1,
            status: 1,
            approved: 1,
            project_setup: 1,
            current_step: 1,
            video: 1,
            created: 1,
            title: 1,
            description: 1,
            user_id: 1,
            style: 1,
            background: 1,
            city: 1,
            country: 1,
            freelancer_type: 1,
            project_type: 1,
            state: 1,
            zipcode: 1,
            end_date: 1,
            hourly_rate: 1,
            start_date: 1,
            payment_type: {
              $cond: {
                if: { $eq: ["$payment_type", 1] },
                then: "Fixed Budget",
                else: "Hourly Payment",
              },
            },
            User: { $arrayElemAt: ["$User", 0] },
          },
        },
      ],
      async (err, result) => {
        console.log(result);
        if (err) {
          return res.send(Myfunction.failResponse("Something went wrong", err));
        }
        if (result.length == 0) {
          return res.send(Myfunction.failResponse("Project Not Found"));
        } else {
          let response = {};
          response.result = result;
          let project_type = await projecttype
            .find()
            .select({ _id: 1, name: 1 });
          let type = {};
          project_type.map((ele) => {
            type[ele._id] = ele.name;
          });
          result[0].projectype = type;
          return res.send(Myfunction.successResponse("success", result));
        }
      }
    );
  });
};

module.exports = {
  view,
  list,
};
