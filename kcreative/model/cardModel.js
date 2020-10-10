const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "Users" },
  payment_reference: { type: String },
  payment_reference_type: { type: Number },
  is_default: { type: Boolean },
  created: { type: Date, default: Date.now },
  type: { type: String },
  number: { type: String },
  expire_month: { type: Number },
  expire_year: { type: Number },
  cvv2: { type: Number },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  customer_id: { type: String },
});

module.exports = mongoose.model("cards", cardsSchema);
