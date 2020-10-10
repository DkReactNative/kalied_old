var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var User = require("./../model/usersModel");
var ChatRoom = require("./../model/chatRoomModel");
var ChatMessage = require("./../model/chatMessageModel");
var Project = require("./../model/projectDetailModel");

module.exports = function (io) {
  io.sockets.on("connection", (clientSocket) => {
    clientSocket.on("join", (data) => {
      if (clientSocket.room) clientSocket.leave(clientSocket.roomName);
      clientSocket.join(data);

      clientSocket.broadcast
        .to(data)
        .emit("user joined", { message: "Someone joined you." });
    });

    clientSocket.on("sendMessage", (messageData) => {
      let sender_id = messageData.senderId,
        message = messageData.message,
        room = messageData.room,
        type = messageData.type ? messageData.type : "text",
        type_details = messageData.type_details ? messageData.type_details : {},
        status = messageData.status ? messageData.status : "None";

      let chat = new ChatMessage({
        type: type,
        room_id: room,
        status: status,
        message: message,
        type_details: type_details,
        sender_id: ObjectId(sender_id),
      });

      chat.save(function (err, data) {
        if (err) throw err;

        io.to(room).emit("new message", data);
      });
    });

    clientSocket.on("updateProposal", (messageData) => {
      let sender_id = messageData.senderId,
        message = messageData.message,
        room = messageData.room,
        type = messageData.type ? messageData.type : "text",
        type_details = messageData.type_details
          ? messageData.type_details
          : null,
        status = messageData.status ? messageData.status : "None",
        message_id = messageData.message_id ? messageData.message_id : "",
        project_id = messageData.project_id ? messageData.project_id : "",
        client_id = messageData.client_id ? messageData.client_id : "";

      let query = {};

      if (message == "Accepted") {
        query["type_details.status"] = "Accepted";
      } else {
        query["type_details.status"] = "Rejected";
      }

      ChatMessage.updateOne(
        { _id: ObjectId(message_id) },
        { $set: query },
        function (error, updated) {
          if (error) throw error;

          if (!error && updated) {
            let chat = new ChatMessage({
              type: type,
              room_id: room,
              status: status,
              message: message,
              type_details: type_details,
              sender_id: ObjectId(sender_id),
            });

            chat.save(function (err, data) {
              if (err) throw err;

              ChatMessage.findOne(
                { _id: ObjectId(message_id) },
                (msgErr, msgData) => {
                  if (msgErr) throw msgErr;

                  let projectQuery = {};

                  let amount = msgData.type_details.amount
                    ? msgData.type_details.amount
                    : null;

                  if (message == "Accepted") {
                    projectQuery["projectAssignedStatus"] = 1;
                    projectQuery["projectPaymentStatus"] = "Pending";
                    projectQuery["projectPaymentAmount"] = amount;
                    projectQuery["freelancer_id"] = ObjectId(sender_id);
                  } else {
                    projectQuery["projectAssignedStatus"] = 0;
                    projectQuery["projectPaymentStatus"] = "None";
                    projectQuery["projectPaymentAmount"] = 0;
                  }

                  Project.updateOne(
                    { _id: ObjectId(project_id) },
                    { $set: projectQuery },
                    (projectErr, projectData) => {
                      if (projectErr) throw projectErr;

                      io.to(room).emit("proposal updated", data);
                    }
                  );
                }
              );
            });
          }
        }
      );
    });

    clientSocket.on("leave", (roomName) => {
      clientSocket.leave(roomName);
    });

    clientSocket.on("disconnect", () => {
      /* … */
    });
  });
};
