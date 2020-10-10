const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;
const CandidateSchema = mongoose.Schema({
  freelancer_id: { type: Schema.Types.ObjectId, ref: "Users" },
  project_id: { type: Schema.Types.ObjectId, ref: "Project" },
  user_id: { type: Schema.Types.ObjectId, ref: "Users" }, // client id who own the project
  message: String,
  hourly_rate: Number,
  total_hours: Number,
  weekly_limit: Number,
  fixed_amount: Number,
  candidate_type: Number, // 1 => invited freelancer , 2 => applied freelancer
  status: { type: Number, default: 1 }, //1 => active
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProjectCandidate", CandidateSchema);
