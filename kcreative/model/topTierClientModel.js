const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TopTierClientSchema = new Schema({
  name: { type: String }, 
  about: { type: String },  
  company: { type: String },
  image: String ,  
  profession:String,
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('TopTierClient', TopTierClientSchema);