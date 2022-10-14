require('dotenv').config();
const mongoose = require('mongoose');

module.exports = mongoose.model(
	'CustomRandom',
	new mongoose.Schema({
		discordId: { type: String, unique: true },
		content: { type: String },
		expired: { type: Date }
	})
);
