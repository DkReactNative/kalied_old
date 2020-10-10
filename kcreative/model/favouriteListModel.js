const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favouriteListSchema = new Schema({
  name: String,
  image: String,
  user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
  status: { type: Number, default: 1 },  // 0=>deleted 1=>active 
  created: { type: Date, default: Date.now },
  lastModified: Date
});

module.exports = mongoose.model('favouriteList', favouriteListSchema);