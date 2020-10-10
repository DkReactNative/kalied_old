var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
const formidable = require("formidable");

const User = require("./../../model/usersModel");
const Myfunction = require("./../../helper/myfunctions");
const Cards = require("./../../model/cardModel");
const Emailtemplates = require("./../../model/emailTempleteModel");
const bcrypt = require("bcryptjs");
const adminHelper = require("./../../helper/adminHelper");
const jwt = require("jsonwebtoken");
const appConfig = require("./../../config/app");
const mailSend = require("./../../helper/mailer");
const { base64encode, base64decode } = require("nodejs-base64");
const niv = require("node-input-validator");
const { Validator } = niv;
const fs = require("fs");

//const ISODate = mongoose.Types.ISODate;
const moment = require("moment");

var Chat = require("./../../model/chatRoomModel");
var ChatMessage = require("./../../model/chatMessageModel");
var Candidates = require("./../../model/projectCandidateModel");

const createRoom = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    let userIds = fields.ids ? fields.ids : [],
      projectId = fields.projectId;

    // let temp = JSON.parse(JSON.stringify(fields));

    // userIds = userIds.map(ObjectId);
    // userIds =
    // userIds = userIds.map(function (e) {
    //   return e.ObjectId();
    // });

    let idsArr = [
      ObjectId("5f475ea9fabf9b06a0981c0c"),
      ObjectId("5ec629a2b5bbea1c4068d3af"),
    ];

    // userIds.forEach((element) => idsArr.push(ObjectId(element)));

    let chat = new Chat({
      userIds: idsArr,
      project_id: projectId,
    });

    chat.save(function (err, room) {
      if (err) {
        return res.send({
          status: 0,
          message: "Something went wrong",
          statuscode: 400,
          response: "",
        });
      }
      return res.send({
        status: 1,
        message: "Room created successfully",
        statuscode: 200,
        response: room,
      });
    });
  });
};

const getRoom = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    let userId = req.user._id ? req.user._id : "";

    Chat.aggregate(
      [
        {
          $match: {
            userIds: { $in: [ObjectId(userId)] },
          },
        },
        // { $unwind: "$project_data" },
        // {
        //   $unwind: { path: "$project_data", preserveNullAndEmptyArrays: true },
        // },
        { $unwind: "$userIds" },
        // Do the lookup matching
        {
          $lookup: {
            from: "users",
            localField: "userIds",
            foreignField: "_id",
            as: "userData",
          },
        },
        { $unwind: "$userData" },
        // Group back to arrays
        {
          $group: {
            _id: "$_id",
            project_id: { $first: "$project_id" },
            created: { $first: "$created" },
            userIds: { $push: "$userIds" },
            userData: { $push: "$userData" },
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "project_id",
            foreignField: "_id",
            as: "project_data",
          },
        },
        {
          $project: {
            _id: 1,
            userData: 1,
            project_data: 1,
            project_id: 1,
            created: 1,
          },
        },
      ],
      function (error, data) {
        if (error) {
          return res.send({
            status: 0,
            message: "Something went wrong",
            statuscode: 400,
            response: "",
            error: error,
          });
        }
        if (!error && data.length == 0) {
          return res.send({
            status: 0,
            message: "No room found",
            statuscode: 400,
            response: "",
          });
        }
        return res.send({
          status: 1,
          message: "",
          statuscode: 200,
          response: data,
        });
      }
    );
  });
};

const getRoomAndMessage = function (req, res) {
  let fields = req.body;
  let sender_id = fields.sender_id,
    receiver_id = fields.receiver_id,
    project_id = fields.project_id,
    is_group = fields.is_group;

  Chat.aggregate(
    [
      {
        $match: {
          $and: [
            { userIds: { $all: [ObjectId(sender_id), ObjectId(receiver_id)] } },
            { is_group: is_group },
            { project_id: ObjectId(project_id) },
          ],
        },
      },
      // { $unwind: "$userIds" },
      {
        $lookup: {
          from: "users",
          localField: "userIds",
          foreignField: "_id",
          as: "userData",
        },
      },
    ],
    function (err, data) {
      if (err)
        return res.send({
          status: 0,
          message: "Something went wrong",
          statuscode: 400,
          response: "",
        });

      if (data.length > 0) {
        getMessage(res, data[0]);
      } else {
        let chat = new Chat({
          userIds: [ObjectId(sender_id), ObjectId(receiver_id)],
          project_id: ObjectId(project_id),
          is_group: is_group,
        });
        chat.save(function (error, roomData) {
          if (error)
            return res.send({
              status: 0,
              message: "Something went wrong",
              statuscode: 400,
              response: "",
            });

          Chat.aggregate(
            [
              {
                $match: {
                  _id: ObjectId(roomData._id),
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userIds",
                  foreignField: "_id",
                  as: "userData",
                },
              },
            ],
            function (err, roomFound) {
              if (err)
                return res.send({
                  status: 0,
                  message: "Something went wrong",
                  statuscode: 400,
                  response: "",
                });

              getMessage(res, roomFound[0]);
            }
          );
        });
      }
    }
  );
};

function getMessage(res, roomData) {
  ChatMessage.aggregate(
    [
      { $match: { room_id: ObjectId(roomData._id) } },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender_data",
        },
      },
    ],
    function (err, data) {
      if (err)
        return res.send({
          status: 0,
          message: "Something went wrong",
          statuscode: 400,
          response: "",
        });

      let obj = {
        roomData: roomData,
        messages: data,
      };

      return res.send({
        status: 1,
        message: "",
        statuscode: 200,
        response: obj,
      });
    }
  );
}

const getInvitedFreelancers = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    let project_id = req.params.project_id ? req.params.project_id : "";

    Candidates.aggregate(
      [
        {
          $match: {
            project_id: ObjectId(project_id),
            candidate_type: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "freelancer_id",
            foreignField: "_id",
            as: "freelancer_data",
          },
        },
        {
          $project: {
            _id: 1,
            candidate_type: 1,
            created: 1,
            freelancer_data: { $arrayElemAt: ["$freelancer_data", 0] },
            message: 1,
            project_id: 1,
            status: 1,
            user_id: 1,
          },
        },
      ],
      function (err, data) {
        if (err)
          return res.send({
            status: 0,
            message: "Something went wrong",
            statuscode: 400,
            response: "",
            err: err,
          });

        if (data.length == 0)
          return res.send({
            status: 0,
            message: "No data found",
            statuscode: 400,
            response: "",
          });

        return res.send({
          status: 1,
          message: "",
          statuscode: 200,
          response: data,
        });
      }
    );
  });
};

module.exports = {
  createRoom,
  getRoom,
  getRoomAndMessage,
  getInvitedFreelancers,
};
