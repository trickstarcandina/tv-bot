const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');
const emoji = require('../../config/emoji');
const coolDown = require('../../config/cooldown');
const reminderCaptcha = require('../../utils/humanVerify/reminderCaptcha');

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
		const checkCoolDown = await this.container.client.checkTimeCoolDown(message.author.id, this.name, coolDown.game.pick, t);
		if (checkCoolDown) {
			return send(message, checkCoolDown);
		}
		const argsLength = args.parser.parserOutput.ordered.length;
		if (argsLength < 3) {
			switch (argsLength) {
				case 0:
					return this.randomNumber(0, 100, message.author.tag, message);
				case 1:
					let max = await args.next();
					if (isNaN(max)) {
						await this.container.client.resetCustomCooldown(message.author.id, this.name);
						return send(
							message,
							t('commands/pick:inputerror', {
								user: message.author.tag,
								prefix: await this.container.client.fetchPrefix(message)
							})
						);
					}
					return this.randomNumber(0, max, message.author.tag, message);
				case 2:
					let minRd = await args.next();
					let maxRd = await args.next();
					if (maxRd < minRd) {
						return this.randomNumber(maxRd, minRd, message.author.tag, message);
					}
					return this.randomNumber(minRd, maxRd, message.author.tag, message);
			}
		}
		const input = [];
		for (let i = 0; i < argsLength; i++) {
			if (i === 0) {
				input.push(parseInt(args.parser.parserOutput.ordered[i].value));
			} else if (i < 4) {
				input.push(args.parser.parserOutput.ordered[i].value);
			} else {
				description += args.parser.parserOutput.ordered[i].value + ' ';
			}
		}

		return this.mainProcess(pickmoney, message, t, message.author.id, message.author.tag, userInfo);
	}

	async randomNumber(max, min, t, tag, message) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return send(
			message,
			t('commands/random:result', {
				result: Math.floor(Math.random() * (max - min + 1)) + min,
				user: tag,
				prefix: await this.container.client.fetchPrefix(message)
			})
		);
	}

	async mainProcess(pickmoney, message, t, userId, tag, userInfo) {
		try {
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
		const checkCoolDown = await this.container.client.checkTimeCoolDown(interaction.user.id, this.name, coolDown.game.pick, t);
		if (checkCoolDown) {
			return await interaction.reply(checkCoolDown);
		}
		let userInfo = await this.container.client.db.fetchUser(interaction.user.id);
		return await this.mainProcess(
			Number(interaction.options.getInteger('pickmoney')),
			interaction,
			t,
			interaction.user.id,
			interaction.user.tag,
			userInfo
		);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pick')
		.setDescription('pick money !!!')
		.addIntegerOption((option) => option.setName('pickmoney').setDescription('Enter an integer').setRequired(true)),
	UserCommand
};
