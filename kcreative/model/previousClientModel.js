const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const PreviouClientSchema = mongoose.Schema({

    client_name: String,
    role: String,
    workedAs: { type: Number, default: 1 },   //1 => freelancer  2 => staff 
    work_length: String,
    start_date: String,
    end_date: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    created: { type: Date, default: Date.now }

});

module.exports = mongoose.model('PreviouClient', PreviouClientSchema);