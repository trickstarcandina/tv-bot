require('dotenv').config();
const mongoose = require('mongoose');

module.exports = mongoose.model(
	'Christmas2022piece',
	new mongoose.Schema({
		discordId: { type: String, unique: true },
		arrayPiece: { type: Array, default: [] },
		count: { type: Number, default: 0 }
	})
);
