const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const awardsSchema = new Schema({
  name: String,
  freelancer_type: { type: Number, default: 0 },  // 1=>Graphic designer 2=> Editor
  status: { type: Number, default: 1 },  // 0=>deleted 1=>active 2=> inactive 
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('awards', awardsSchema);