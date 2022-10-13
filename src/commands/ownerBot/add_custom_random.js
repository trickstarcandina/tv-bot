const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const { logger } = require('../../utils/index');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'add_custom_random',
			description: 'add custom random to user',
			usage: 'tadd_custom_random <id / @mention> <unlimit/amount>',
			example: 'tadd_custom_random 662508642251309057'
		});
	}
	async messageRun(message, args) {
		const t = await fetchT(message);
		try {
			if (process.env.OWNER_IDS.split(',').includes(message.author.id)) {
				let mentionUser = message.mentions.users.first();
				let userInfo = null;
				const mentions = await args.next();
				const amount = await args.next();
				if (!mentionUser) {
					userInfo = await this.container.client.db.checkExistUser(mentions);
				} else {
					userInfo = await this.container.client.db.checkExistUser(mentionUser.id);
				}
				if (!userInfo) {
					return message.channel.send('Cannot find user');
				}
				let discordId = mentionUser ? mentionUser.id : mentions;
				if (amount === 'unlimit') {
					await this.container.client.db.registerCustomRandom(discordId, 1907);
				} else if (amount !== null && !isNaN(amount)) {
					await this.container.client.db.registerCustomRandom(discordId, Number(amount));
				} else {
					await this.container.client.db.registerCustomRandom(discordId, 1);
				}
				logger.warn(`User: ${discordId} | add customRandom | By ${message.author.id}`);
				return message.channel.send(`Successfully added customrandom to <@${discordId}>`);
			}
		} catch (err) {
			logger.error(err);
			return await send(message, t('other:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}
}

exports.UserCommand = UserCommand;
