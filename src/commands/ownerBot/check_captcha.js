const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const { logger } = require('../../utils/index');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'check_captcha',
			description: 'check captcha of user',
			usage: 'tcheck_captcha <id / @mention>',
			example: 'tcheck_captcha 662508642251309057'
		});
	}

	async messageRun(message, args) {
		const t = await fetchT(message);
		try {
			if (process.env.OWNER_IDS.split(',').includes(message.author.id) || process.env.MOD_IDS.split(',').includes(message.author.id)) {
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
				let captchaSchema = await this.container.client.db.getCaptchaByDiscordId(discordId);
				return message.channel.send(captchaSchema.captcha);
			}
		} catch (err) {
			logger.error(err);
			return await send(message, t('other:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}
}

exports.UserCommand = UserCommand;
