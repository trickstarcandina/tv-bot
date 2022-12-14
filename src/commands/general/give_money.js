const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const WynnCommand = require('../../lib/Structures/WynnCommand');
const emoji = require('../../config/emoji');
const { logger } = require('../../utils/index');
const utils = require('../../lib/utils');
const { SlashCommandBuilder } = require('@discordjs/builders');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'give_money',
			aliases: ['give_money', 'give_currency', 'give_cash', 'give_credit', 'give_balance', 'give'],
			description: 'commands/give_money:description',
			usage: 'commands/give_money:usage',
			example: 'commands/give_money:example',
			cooldownDelay: 10000,
			preconditions: [['RestrictUser']]
		});
	}

	async messageRun(message, args) {
		const t = await fetchT(message);
		//user give
		const userGiveInfo = await this.container.client.db.fetchUser(message.author.id);
		//user receive
		let mentionUser = message.mentions.users.first();
		let userReceiveInfo = null;
		const mentions = await args.next();
		const money = await args.next();

		if (!mentionUser) {
			userReceiveInfo = await this.container.client.db.checkExistUser(mentions);
		} else {
			userReceiveInfo = await this.container.client.db.checkExistUser(mentionUser.id);
		}

		if (!userReceiveInfo) {
			return await send(
				message,
				t('commands/give_money:usererror', {
					user: message.author.tag
				})
			);
		}

		if (!money || !Number.isInteger(parseInt(money)) || money < 1) {
			return send(
				message,
				t('commands/give_money:inputerror', {
					user: message.author.tag,
					prefix: await this.container.client.fetchPrefix(message)
				})
			);
		}
		return await this.mainProcess(message, money, message.author.tag, userGiveInfo, userReceiveInfo, t);
	}

	async mainProcess(message, money, tag, userGiveInfo, userReceiveInfo, t) {
		try {
			const moneyEmoji = emoji.common.money;

			if (userGiveInfo.money < money) {
				return await utils.returnContentForSlashOrSendMessage(
					message,
					t('commands/give_money:nomoney', {
						user: tag
					})
				);
			}

			await this.container.client.db.transactionItemUser(
				userReceiveInfo.discordId,
				userGiveInfo.discordId,
				{
					$inc: {
						money: parseInt(money)
					}
				},
				{
					$inc: {
						money: -parseInt(money)
					}
				}
			);

			return await utils.returnContentForSlashOrSendMessage(
				message,
				t('commands/give_money:result', {
					user: tag,
					value: money,
					emoji: moneyEmoji,
					target: `<@${userReceiveInfo.discordId}>`
				})
			);
		} catch (err) {
			logger.error(err);
			return await send(message, t('other:error', { supportServer: process.env.SUPPORT_SERVER_LINK }));
		}
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		if (interaction.options.getInteger('money') < 1) {
			return await interaction.reply(
				t('commands/give_money:inputerror', {
					user: interaction.user.tag,
					prefix: await this.container.client.fetchPrefix(interaction)
				})
			);
		}
		return await interaction.reply(
			await this.mainProcess(
				interaction,
				interaction.options.getInteger('money'),
				interaction.user.tag,
				await this.container.client.db.fetchUser(interaction.user.id),
				await this.container.client.db.fetchUser(interaction.options.getUser('target').id),
				t
			)
		);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give_money')
		.setDescription('Give money to other user')
		.addIntegerOption((option) => option.setName('money').setDescription('Enter an integer').setRequired(true))
		.addUserOption((option) => option.setName('target').setDescription('Select a user').setRequired(true)),
	UserCommand
};
