const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');
const { MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'custom_random',
			aliases: ['custom_random', 'cr'],
			description: 'commands/customRandom:description',
			usage: 'commands/customRandom:usage',
			example: 'commands/customRandom:example',
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
			if (content === null && customRandom) {
				// return time in use
				return await utils.returnSlashAndMessage(
					message,
					t('commands/customRandom:duration', {
						user: tag,
						time: time(customRandom.expired)
					})
				);
			} else if (content === 'info' || content === null) {
				// return info
				return this.infoBank(message, t);
			} else if (content !== null && !customRandom) {
				return await utils.returnSlashAndMessage(
					message,
					t('commands/customRandom:noperm', {
						user: tag
					})
				);
			}
			// end check user
			if (!content.includes('<number>')) {
				return await utils.returnSlashAndMessage(
					message,
					t('commands/customRandom:inputerror', {
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
					t('commands/customRandom:result', {
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

	async infoBank(message, t) {
		let embedMSG = new MessageEmbed()
			.setTitle(t('commands/customRandom:title'))
			.setDescription(t('commands/customRandom:descrp'))
			.addFields(
				{ name: t('commands/customRandom:tpbank'), value: t('commands/customRandom:tpbankinfo'), inline: true },
				{ name: t('commands/customRandom:momo'), value: t('commands/customRandom:momoinfo'), inline: true }
			)
			.setFooter({ text: t('commands/customRandom:footer') })
			.setImage('https://cdn.discordapp.com/attachments/775932756214939658/1030316568359489627/ipiccy_image.jpg');
		return await utils.returnSlashAndMessage(message, { embeds: [embedMSG] });
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		return await this.mainProcess(interaction, t, interaction.user.id, interaction.options.getString('text'), interaction.user.tag);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('custom_random')
		.setDescription('set custom random !!!')
		.addStringOption((option) => option.setName('text').setDescription('Enter a string').setRequired(false)),
	UserCommand
};
