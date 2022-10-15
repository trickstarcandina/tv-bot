const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');
const emoji = require('../../config/emoji');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'random',
			aliases: ['random', 'rd'],
			description: 'commands/random:description',
			usage: 'commands/random:usage',
			example: 'commands/random:example',
			cooldownDelay: 7000,
			preconditions: [['RestrictUser']]
		});
	}

	async messageRun(message, args) {
		const t = await fetchT(message);
		const argsLength = args.parser.parserOutput.ordered.length;
		try {
			let checkArgs1 = true;
			if (args.parser.parserOutput.ordered[0] !== undefined) {
				checkArgs1 = isNaN(args.parser.parserOutput.ordered[0].value);
			}
			let checkArgs2 = true;
			if (args.parser.parserOutput.ordered[1] !== undefined) {
				checkArgs2 = isNaN(args.parser.parserOutput.ordered[1].value);
			}
			if (argsLength < 3 || !checkArgs1) {
				switch (argsLength) {
					case 0:
						return this.randomNumber(0, 100, t, message.author.tag, message, message.author.id);
					case 1:
						if (checkArgs1) {
							break;
						}
						let max = await args.next();
						return this.randomNumber(0, max, t, message.author.tag, message, message.author.id);
					case 2:
						if (checkArgs1 === false && checkArgs2 === true) {
							let max = await args.next();
							return this.randomNumber(0, max, t, message.author.tag, message, message.author.id);
						} else if (checkArgs1) {
							break;
						}
						let minRd = await args.next();
						let maxRd = await args.next();
						if (maxRd < minRd) {
							return this.randomNumber(maxRd, minRd, t, message.author.tag, message, message.author.id);
						}
						return this.randomNumber(minRd, maxRd, t, message.author.tag, message, message.author.id);
					default:
						if (!checkArgs1 && !checkArgs2) {
							let minRd = await args.next();
							let maxRd = await args.next();
							if (maxRd < minRd) {
								return this.randomNumber(maxRd, minRd, t, message.author.tag, message, message.author.id);
							}
							return this.randomNumber(minRd, maxRd, t, message.author.tag, message, message.author.id);
						} else if (!checkArgs1) {
							let max = await args.next();
							return this.randomNumber(0, max, t, message.author.tag, message, message.author.id);
						} else {
							break;
						}
				}
			}
			let input = args.message.content.split(',');
			input[0] = input[0].substring(input[0].indexOf(' ') + 1, input[0].length);
			for (let index = 0; index < input.length; index++) {
				input[index] = input[index].trim();
			}
			return this.randomString(input, t, message.author.tag, message, message.author.id);
		} catch (err) {
			logger.error(err);
			return await send(message, t('other:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}

	async randomNumber(max, min, t, tag, message, userId) {
		min = Math.ceil(min);
		max = Math.floor(max);
		// edit this
		let customRandom = await this.container.client.db.findCustomRandom(userId);
		if (customRandom) {
			return await utils.returnSlashAndMessage(
				message,
				customRandom.content.replace('<number>', Math.floor(Math.random() * (max - min + 1)) + min)
			);
		}
		return await utils.returnSlashAndMessage(
			message,
			t('commands/random:result', {
				result: Math.floor(Math.random() * (max - min + 1)) + min,
				user: tag,
				emoji: emoji.utility.random.emoji
			})
		);
	}

	async randomString(input, t, tag, message, userId) {
		let customRandom = await this.container.client.db.findCustomRandom(userId);
		if (customRandom) {
			return await utils.returnSlashAndMessage(
				message,
				customRandom.content.replace('<number>', input[Math.floor(Math.random() * input.length)])
			);
		}
		return await utils.returnSlashAndMessage(
			message,
			t('commands/random:resultString', {
				result: input[Math.floor(Math.random() * input.length)],
				user: tag,
				emoji: emoji.utility.random.emoji
			})
		);
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		let max = interaction.options.getInteger('upper');
		let min = interaction.options.getInteger('lower');
		max = max === null ? 100 : max;
		min = min === null ? 0 : min;
		if (max < min) {
			return await this.randomNumber(min, max, t, interaction.user.tag, interaction, interaction.user.id);
		}
		return await this.randomNumber(max, min, t, interaction.user.tag, interaction, interaction.user.id);
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
