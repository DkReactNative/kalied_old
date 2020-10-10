const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const expertiseLevelAndPricing = mongoose.Schema({

    experience_level: { type: Number, default: 1 },  
    experience_year : Number,
    hourly_rate: Number , 
    minimum_fixed_price : Number,        
    user_id :{	type: Schema.Types.ObjectId, ref: 'Users'},
    created: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model('ExpertiseLevel', expertiseLevelAndPricing);