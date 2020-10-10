const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const howItWorksSchema = new Schema({
  title: { type: String }, 
  title_description: { type: String },  
  description1: { type: String },
  description2: String ,   
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('howItWorks', howItWorksSchema);