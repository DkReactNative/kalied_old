const mongoose = require('mongoose');

const emailTempleteSchema = mongoose.Schema({

	title: String,
	subject: String,
	content: String,
	slug: { type: String, lowercase: true},
	status: {type : Number, default:1},
	created: {type: Date, default: Date.now},
	lastModified: Date

});

module.exports = mongoose.model('EmailTemplates', emailTempleteSchema);