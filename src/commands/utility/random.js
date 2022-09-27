const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');
const coolDown = require('../../config/cooldown');
const reminderCaptcha = require('../../utils/humanVerify/reminderCaptcha');
const emoji = require('../../config/emoji');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'random',
			aliases: ['random', 'rd'],
			description: 'commands/random:description',
			usage: 'commands/random:usage',
			example: 'commands/random:example'
		});
	}

	async messageRun(message, args) {
		let isBlock = await this.container.client.db.checkIsBlock(message.author.id);
		if (isBlock === true) return;
		if (this.container.client.options.spams.get(`${message.author.id}`) === 'warn' || (isBlock.length > 0 && !isBlock[0].isResolve)) {
			return await reminderCaptcha(message, this.container.client, message.author.id, message.author.tag);
		}
		const t = await fetchT(message);
		const checkCoolDown = await this.container.client.checkTimeCoolDown(message.author.id, this.name, coolDown.utility.random, t);
		if (checkCoolDown) {
			return send(message, checkCoolDown);
		}
		const argsLength = args.parser.parserOutput.ordered.length;
		if (argsLength < 3) {
			switch (argsLength) {
				case 0:
					return this.randomNumber(0, 100, t, message.author.tag, message);
				case 1:
					if (isNaN(args.parser.parserOutput.ordered[0])) {
						break;
					}
					let max = await args.next();
					if (isNaN(max)) {
						await this.container.client.resetCustomCooldown(message.author.id, this.name);
						return send(
							message,
							t('commands/random:inputerror', {
								user: message.author.tag,
								prefix: await this.container.client.fetchPrefix(message)
							})
						);
					}
					return this.randomNumber(0, max, t, message.author.tag, message);
				case 2:
					if (isNaN(args.parser.parserOutput.ordered[0]) || isNaN(args.parser.parserOutput.ordered[1])) {
						break;
					}
					let minRd = await args.next();
					let maxRd = await args.next();
					if (maxRd < minRd) {
						return this.randomNumber(maxRd, minRd, t, message.author.tag, message);
					}
					return this.randomNumber(minRd, maxRd, t, message.author.tag, message);
			}
		}
		let input = args.message.content.split(',');
		input[0] = input[0].substring(input[0].indexOf(' ') + 1, input[0].length);
		for (let index = 0; index < input.length; index++) {
			input[index] = input[index].trim();
		}
		return this.randomString(input, t, message.author.tag, message);
	}

	async randomNumber(max, min, t, tag, message) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return await utils.returnSlashAndMessage(
			message,
			t('commands/random:result', {
				result: Math.floor(Math.random() * (max - min + 1)) + min,
				user: tag,
				emoji: emoji.utility.random.emoji
			})
		);
	}

	async randomString(input, t, tag, message) {
		try {
			return await utils.returnSlashAndMessage(
				message,
				t('commands/random:resultString', {
					result: input[Math.floor(Math.random() * input.length)],
					user: tag,
					emoji: emoji.utility.random.emoji
				})
			);
		} catch (err) {
			logger.error(err);
			return await send(message, t('other:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}

	async execute(interaction) {
		let isBlock = await this.container.client.db.checkIsBlock(interaction.user.id);
		if (isBlock === true) return;
		if (this.container.client.options.spams.get(`${interaction.user.id}`) === 'warn' || (isBlock.length > 0 && !isBlock[0].isResolve)) {
			return await reminderCaptcha(interaction, this.container.client, interaction.user.id, interaction.user.tag);
		}
		const t = await fetchT(interaction);
		const checkCoolDown = await this.container.client.checkTimeCoolDown(interaction.user.id, this.name, coolDown.utility.random, t);
		if (checkCoolDown) {
			return await interaction.reply(checkCoolDown);
		}
		let max = interaction.options.getInteger('upper');
		let min = interaction.options.getInteger('lower');
		max = max === null ? 100 : max;
		min = min === null ? 0 : min;
		if (max < min) {
			return await this.randomNumber(min, max, t, interaction.user.tag, interaction);
		}
		return await this.randomNumber(max, min, t, interaction.user.tag, interaction);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('random')
		.addIntegerOption((option) => option.setName('upper').setDescription('Enter an integer max').setRequired(false))
		.addIntegerOption((option) => option.setName('lower').setDescription('Enter an integer min').setRequired(false)),
	UserCommand
};
