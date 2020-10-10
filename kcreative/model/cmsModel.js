const mongoose = require('mongoose');

const cmsSchema = mongoose.Schema({

	title: String,
	content: String,
	slug: { type: String, lowercase: true},
	status: {type : Number, default:1},
	created: {type: Date, default: Date.now},
	lastModified: Date

});

module.exports = mongoose.model('CmsPages', cmsSchema);