const schema = require('../schema/christmas2022piece');

module.exports.getChristmasByDiscord = async function (key) {
	return await schema.findOne({ discordId: key });
};

module.exports.increaseChristmasCount = async function (discordId, amount) {
	return await schema.updateOne(
		{ discordId: discordId },
		{
			$inc: {
				count: amount
			}
		},
		{ new: true }
	);
};

module.exports.updateChristmasPiece = async function (discordId, idPiece) {
	let eventDB = await schema.findOne({ discordId: discordId });
	if (eventDB) {
		let setPiece = new Set(eventDB.arrayPiece);
		if (setPiece.has(idPiece)) return;
		return await schema.updateOne(
			{ discordId: discordId },
			{
				$push: {
					arrayPiece: idPiece
				}
			},
			done
		);
	}
};
