const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const { logger } = require('../../utils/index');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');
const { Permissions } = require('discord.js');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'disable',
			description: 'commands/disable:description',
			aliases: ['disable'],
			usage: 'commands/disable:usage',
			example: 'commands/disable:example',
			preconditions: ['GuildOnly', ['AdminOnly']],
			cooldownDelay: 15000,
			preconditions: [['RestrictUser']]
		});
	}

	async messageRun(message, args) {
		const t = await fetchT(message);
		const arg = await args.pick('string').catch(() => null);
		return this.mainProcess(arg, message, t);
	}

	async mainProcess(arg, message, t) {
		try {
			let commands = await arg.rest('string').catch(() => null);
			for (let i = 0; i < commands.length; i++) commands[i] = commands[i].toLowerCase();
			if (commands.includes('all')) {
				// return all commands disable this channel
			}
		} catch (err) {
			logger.error(err);
			return send(message, t('commands/language:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return await interaction.reply(await this.mainProcess(interaction.options.getString('command'), interaction, t));
		}
		return await interaction.reply(t('preconditions:AdminOnly'));
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disable')
		.setDescription('disable command in server')
		.addStringOption((option) => option.setName('command').setDescription('Enter command you want to disable').setRequired(true)),
	UserCommand
};
