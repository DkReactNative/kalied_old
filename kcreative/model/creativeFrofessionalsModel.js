const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CreativeProfessionalSchema = new Schema({
  name: { type: String }, 
  about: { type: String },  
  comment: { type: String },
  image: String ,  
  profession:{ type: Number }, // 1. Editor // 2 Graphic Designer
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('CreativeProfessional', CreativeProfessionalSchema);