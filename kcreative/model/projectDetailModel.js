const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const ProjectSchema = mongoose.Schema({
  title: String,
  description: String,
  style: String,
  skills: Array,
  background: String,
  images: Array,
  files: Array, //  the pdf file name
  video: [
    {
      url: String,
      description: String,
    },
  ],
  freelancer_type: Number,
  project_type: Schema.Types.ObjectId,
  genere: Array,
  industry: Array,
  address: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    },
  },
  payment_type: Number,
  hourly_rate: Number,
  fixed_budget: Array,
  start_date: Date,
  end_date: Date,
  user_id: { type: Schema.Types.ObjectId, ref: "Users" },
  freelancer_id: { type: Schema.Types.ObjectId, ref: "Users" },
  status: { type: Number, default: 1 }, //0 => invalid 1 => open  2=> in progress (booked by freelancer) 3=> cancelled (by client) 4 => cancelled (by freelancer)  5 => completed  6 => closed  7 => Deleted
  cancellation_reason: String,
  approved: { type: Number, default: 1 },
  project_setup: { type: Number, default: 0 }, // 1 => project setup  0=> project not setup
  current_step: { type: Number, default: 1 }, // 1=> step1,2=>step2 ,3 => step 3 ,4 => step4 , 5 => post step5
  created: { type: Date, default: Date.now },
  projectAssignedStatus: { type: Number, default: 0 }, // 0 => not assigned, 1 => assigned
  projectPaymentStatus: { type: String, default: "None" },
  projectPaymentAmount: { type: Number },
});
ProjectSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Project", ProjectSchema);
