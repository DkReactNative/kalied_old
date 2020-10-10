const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
  room_id: { type: Schema.Types.ObjectId, ref: "ChatRoom" },
  message: { type: String, default: "" },
  sender_id: { type: Schema.Types.ObjectId, ref: "Users" },
  created: { type: Date, default: Date.now },
  type: { type: String, default: "text" },
  type_details: { type: Object },
  // amount: { type: Number },
  // status: { type: String, default: "None" },
});

module.exports = mongoose.model("chatmessages", chatMessageSchema);
