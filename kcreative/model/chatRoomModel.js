const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
  // freelancer_id: { type: Schema.Types.ObjectId, ref: "Users" },
  // client_id: { type: Schema.Types.ObjectId, ref: "Users" },
  userIds: Array,
  project_id: { type: Schema.Types.ObjectId, ref: "Project" },
  is_group: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("chatrooms", chatRoomSchema);
