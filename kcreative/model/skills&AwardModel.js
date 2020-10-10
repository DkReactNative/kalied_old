const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const skillsSchema = mongoose.Schema({

    primary_skills: Array,
    secondary_skills : Array,
    graphic_specialities: Array , // freelancer who's type graphic designer
    editing_style : Array,        // freelancer who's type Editor
    awards: Array,
    user_id :{	type: Schema.Types.ObjectId, ref: 'Users'},
    created: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model('Skills', skillsSchema);