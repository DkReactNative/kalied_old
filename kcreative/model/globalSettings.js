var mongoose = require('mongoose');
var globalSettingsSchema = mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  slug: {
    type: String,
    default: ""
  },
  value: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "G"
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

var GlobalSettings = mongoose.model('GlobalSettings',globalSettingsSchema);

module.exports = GlobalSettings;
