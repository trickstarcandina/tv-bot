require('dotenv').config();
const mongoose = require('mongoose');

const disableCommandSchema = new mongoose.Schema({
	channelId: { type: String },
	command: { type: String }
});

disableCommandSchema.index({ channelId: 1, command: 1 }, { unique: true });

module.exports = mongoose.model('DisableCommand', disableCommandSchema);
