const customRandomSchema = require('../schema/customRandom');

module.exports.registerCustomRandom = async function (discordId, month) {
	let customRandom = await customRandomSchema.findOne({ discordId: discordId });
	if (customRandom) {
		let time = Date.now();
		if (time < customRandom.expired) {
			time = customRandom.expired.getDate();
		}
		customRandom.expired.setDate(time + parseInt(30 * month));
		return await customRandomSchema.updateOne({ discordId: discordId }, { expired: customRandom.expired });
	} else {
		customRandom = new customRandomSchema({
			discordId: discordId,
			content: '<number>',
			expired: Date.now() + 30 * 24 * 60 * 60 * 1000 * month
		});
		return await customRandom.save().catch((err) => console.log(err));
	}
};

module.exports.findCustomRandom = async function (discordId) {
	return await customRandomSchema.findOne({ discordId: discordId, expired: { $gte: new Date() } });
};

module.exports.updateCustomRandom = async function (customRandom) {
	return await customRandom.save().catch((err) => console.log(err));
};
