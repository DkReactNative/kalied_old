const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aboutUsSchema = new Schema({
  title: { type: String }, 
  title_descrition: { type: String },  
  description1: { type: String },
  description2: String ,  
  leftimage:String,
  rightimage:String,
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('aboutUs', aboutUsSchema);