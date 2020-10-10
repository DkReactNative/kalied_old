const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const portFolioSchema = mongoose.Schema({

    thumb_image: String,
    video_url: String,
    tags: Array,
    client_name: String,
    project_name: String,
    project_type: String,
    genre: Array,
    industry: Array,
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    status: { type: Number, default: 1 }, //1 => active  0 hide
    created: { type: Date, default: Date.now }

});

module.exports = mongoose.model('PortFolio', portFolioSchema);