require('dotenv').config();
const mongoose = require('mongoose');

module.exports = mongoose.model(
	'VoiceInfo',
	new mongoose.Schema({
		discordId: { type: String, unique: true },
		totalTime: { type: Number, default: 0 },
		month: { type: Number }
	})
);
