const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactUsSchema = new Schema({
  title: { type: String }, 
  title_descrition: { type: String },  
  get_in_touch: { type: String },
  support: {
        descrition: String,
        email: Array,
       },  
  customer: {
        descrition: String,
        phone: Array,
       },
   address: {
    descrition: String,
    address: Array,
   },
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('contactUs', contactUsSchema);