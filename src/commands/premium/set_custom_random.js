const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'set_custom_random',
			aliases: ['set_custom_random', 'setcr'],
			description: 'commands/setCustomRandom:description',
			usage: 'commands/setCustomRandom:usage',
			example: 'commands/setCustomRandom:example',
			cooldownDelay: 15000,
			preconditions: [['RestrictUser']]
		});
	}

	async messageRun(message, args) {
		const t = await fetchT(message);
		let input = await args.rest('string').catch(() => null);
		return this.mainProcess(message, t, message.author.id, input, message.author.tag);
	}
	async mainProcess(message, t, userId, content, tag) {
		try {
			let customRandom = await this.container.client.db.findCustomRandom(userId);
			if (!customRandom) {
				return await utils.returnSlashAndMessage(
					message,
					t('commands/setCustomRandom:noperm', {
						user: tag
					})
				);
			}
			if (content === null || !content.includes('<text>')) {
				return await utils.returnSlashAndMessage(
					message,
					t('commands/setCustomRandom:inputerror', {
						user: tag,
						prefix: await this.container.client.fetchPrefix(message)
					})
				);
			}
			customRandom.content = content;
			return await Promise.all([
				this.container.client.db.updateCustomRandom(customRandom),
				utils.returnSlashAndMessage(
					message,
					t('commands/setCustomRandom:result', {
						user: tag,
						content: content
					})
				)
			]);
		} catch (err) {
			logger.error(err);
			return await send(message, t('other:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		return await this.mainProcess(interaction, t, interaction.user.id, interaction.options.getString('text'), interaction.user.tag);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_custom_random')
		.setDescription('set custom random !!!')
		.addStringOption((option) => option.setName('text').setDescription('Enter a string').setRequired(true)),
	UserCommand
};
