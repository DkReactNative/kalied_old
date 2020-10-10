const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favouriteListSchema = new Schema({
  list_id:  {	type: Schema.Types.ObjectId, ref: 'favouriteList'},
  freelancer_id: {	type: Schema.Types.ObjectId, ref: 'Users'},
  user_id : {	type: Schema.Types.ObjectId, ref: 'Users'},
  note: String,
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('favourateUser',favouriteListSchema);