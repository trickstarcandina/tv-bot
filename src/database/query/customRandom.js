const customRandomSchema = require('../schema/customRandom');

module.exports.registerCustomRandom = async function (discordId, month) {
	let customRandom = await customRandomSchema.findOne({ discordId: discordId });
	if (customRandom) {
		customRandom.expired = (Date.now() > customRandom.expired ? Date.now() : customRandom.expired) + 30 * 24 * 60 * 60 * 1000 * month;
	} else {
		customRandom = new customRandomSchema({
			discordId: discordId,
			content: '<text>',
			expired: Date.now() + 30 * 24 * 60 * 60 * 1000 * month
		});
	}
	await customRandom.save().catch((err) => console.log(err));
	return customRandom;
};

module.exports.findCustomRandom = async function (discordId) {
	return customRandomSchema.findOne({ discordId: discordId, expired: { $gte: new Date() } });
};

module.exports.updateCustomRandom = async function (customRandom) {
	return await customRandom.save().catch((err) => console.log(err));
};
