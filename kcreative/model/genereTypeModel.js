const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genereTypeSchema = new Schema({
    name: String,
    project_type: { type: Schema.Types.ObjectId, ref: 'projectType' },
    status: { type: Number, default: 1 }, // 0=>deleted 1=>active 2=> inactive 
    created: { type: Date, default: Date.now },
    lastModified: Date
});

module.exports = mongoose.model('genereType', genereTypeSchema);