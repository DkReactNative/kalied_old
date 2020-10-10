const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FaqSchema = new Schema({
  question: String,
  answer: String,
  slug: { type: String, lowercase: true }, 
  status: Number,
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('Faq', FaqSchema);