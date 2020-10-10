const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectTypeSchema = new Schema({
  name: String,
  status: { type: Number, default:1 },  // 0=>deleted 1=>active 2=> inactive 
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('projectType', projectTypeSchema);