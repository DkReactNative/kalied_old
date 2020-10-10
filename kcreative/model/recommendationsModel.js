const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const recommendationSchema = mongoose.Schema({
    type: { type: Number, default: 1 },  // 1 => linkedin 2 => new  
    reference_name: String,
    positions: String,
    company: String,
    recommendation_text: String,
    email: String,
    //  url: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    created: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Recommendation', recommendationSchema);