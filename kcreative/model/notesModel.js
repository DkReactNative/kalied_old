const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notesSchema = new Schema({
  freelancer_id: {	type: Schema.Types.ObjectId, ref: 'Users'},
  note : String,
  user_id : {	type: Schema.Types.ObjectId, ref: 'Users'},
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('notes',notesSchema);