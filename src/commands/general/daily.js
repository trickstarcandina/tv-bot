const { fetchT } = require('@sapphire/plugin-i18next');
const WynnCommand = require('../../lib/Structures/WynnCommand');
const emoji = require('../../config/emoji');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'daily',
			aliases: ['daily'],
			description: 'commands/daily:description',
			usage: 'commands/daily:usage',
			example: 'commands/daily:example',
			cooldownDelay: 10000,
			preconditions: [['RestrictUser']]
		});
	}

	async messageRun(message) {
		const moneyEmoji = emoji.common.money;
		const t = await fetchT(message);
		let userId = message.type === 'APPLICATION_COMMAND' ? message.user.id : message.author.id;
		let tag = message.type === 'APPLICATION_COMMAND' ? message.user.tag : message.author.tag;
		const dailyInfo = await this.container.client.db.getDailyInfo(userId);
		if (dailyInfo != null && dailyInfo.lastDaily.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
			return utils.returnContentForSlashOrSendMessage(
				message,
				t('commands/daily:attendance', {
					user: tag
				})
			);
		}
		let moneyDaily = 500;
		let dailyStreak = dailyInfo !== null ? dailyInfo.dailyStreak : 0;
		//reset streak
		if (dailyStreak > 0 && Date.now() - dailyInfo.lastDaily >= 259200000) {
			dailyStreak = 0;
		}
		moneyDaily += dailyStreak * 100;
		if (moneyDaily > 5000) {
			moneyDaily = 5000;
		}
		dailyStreak++;
		await this.container.client.db.updateUser(userId, {
			$inc: {
				money: moneyDaily
			}
		});
		await this.container.client.db.setDailyInfo(userId, {
			$set: { dailyStreak: dailyStreak, lastDaily: new Date() }
		});
		return utils.returnContentForSlashOrSendMessage(
			message,
			t('commands/daily:result', {
				user: tag,
				moneyDaily: moneyDaily,
				dailyStreak: dailyStreak,
				emoji: moneyEmoji
			})
		);
	}

	async execute(interaction) {
		return await interaction.reply(await this.messageRun(interaction));
	}
}

module.exports = {
	data: new SlashCommandBuilder().setName('daily').setDescription('Take attendance and receive gifts every day'),
	UserCommand
};
