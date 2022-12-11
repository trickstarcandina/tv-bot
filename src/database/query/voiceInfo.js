const schema = require('../schema/voiceInfo');
const month = new Date().getMonth();

module.exports.getVoiceInfoByDiscord = async function (key) {
	return await schema.findOne({ discordId: key, month: month });
};

module.exports.increaseTotalTime = async function (discordId, amount) {
	// find in this month
	let timeInfo = await schema.findOne({ discordId: discordId, month: month });
	if (timeInfo) {
		return await schema.updateOne(
			{ discordId: discordId },
			{
				$inc: {
					totalTime: amount
				}
			}
		);
	}
	timeInfo = new schema({
		discordId: discordId,
		month: month,
		totalTime: amount
	});
	return await timeInfo.save().catch((err) => console.log(err));
};
