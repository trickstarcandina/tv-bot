const disableCommandSchema = require('../schema/disableCommand');

module.exports.checkDisableCommand = async function (channelId, nameCommand) {
	let disableCommand = await disableCommandSchema.findOne({
		channelId: channelId,
		$or: [{ command: 'all' }, { command: nameCommand }]
	});
	return disableCommand ? true : false;
};

module.exports.createDisableCommand = async function (channelId, command) {
	let disableCommand = new disableCommandSchema({
		channelId: channelId,
		command: command
	});
	return await disableCommand.save().catch((err) => console.log(err));
};

module.exports.deleteDisableCommand = async function (channelId, command) {
	return await disableCommandSchema.deleteOne({
		channelId: channelId,
		command: command
	});
};
