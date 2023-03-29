const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { evaluate } = require('mathjs');
const utils = require('../../lib/utils');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'math',
			aliases: ['math', 'm'],
			description: 'commands/math:description',
			usage: 'commands/math:usage',
			example: 'commands/math:example',
			cooldownDelay: 7000,
			preconditions: [['RestrictUser']]
		});
	}

	async messageRun(message, args) {
		const t = await fetchT(message);
		try {
			let input = args.message.content.split(' ');
			let stringExpression = '';
			for (let index = 1; index < input.length; index++) {
				stringExpression = stringExpression + input[index].trim();
			}
			stringExpression = stringExpression.replace(/\s+/g, '');
			try {
				const re = /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/;
				if (re.test(stringExpression)) {
					return await utils.returnSlashAndMessage(
						message,
						t('commands/math:result', { user: message.author.tag, res: evaluate(stringExpression) })
					);
				}
				return await utils.returnSlashAndMessage(message, t('commands/math:input_error'));
			} catch (err) {
				return await utils.returnSlashAndMessage(message, t('commands/math:input_error'));
			}
		} catch (err) {
			logger.error(err);
			return await send(message, t('other:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		let userInfo = await this.container.client.db.fetchUser(interaction.user.id);
		return await interaction.reply('none');
	}
}

module.exports = {
	data: new SlashCommandBuilder().setName('math').setDescription('math'),
	UserCommand
};
