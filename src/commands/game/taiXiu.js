const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');
const wait = require('node:timers/promises').setTimeout;

const game = require('../../config/game');
const emoji = require('../../config/emoji');
const moneyEmoji = emoji.common.money;
const dices = {
	one: emoji.game.taixiu.one,
	two: emoji.game.taixiu.two,
	three: emoji.game.taixiu.three,
	four: emoji.game.taixiu.four,
	five: emoji.game.taixiu.five,
	six: emoji.game.taixiu.six
};
const loadEmoji = emoji.game.taixiu.dice;

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'taixiu',
			aliases: ['tx', 'taixiu'],
			description: 'commands/taixiu:description',
			usage: 'commands/taixiu:usage',
			example: 'commands/taixiu:example',
			cooldownDelay: 25000,
			preconditions: [['RestrictUser']]
		});
	}

	async messageRun(message, args) {
		const t = await fetchT(message);
		// let input = await args.next();
		// let userInfo = await this.container.client.db.fetchUser(message.author.id);
		// let betMoney = input === 'all' ? (maxBet <= userInfo.money ? maxBet : userInfo.money) : Number(input);
		//syntax check
		// if (isNaN(betMoney) || input === null) {
		return await this.randomTaiXiu(message, t);
		// }
		// return this.mainProcess(betMoney, message, t, userInfo, message.author.id, message.author.tag);
	}

	async randomTaiXiu(message, t) {
		let randDices = [];
		while (randDices.length < 3) {
			randDices.push(Math.floor(Math.random() * 6));
		}
		let result1 = convertEmoji(randDices[0], dices);
		let result2 = convertEmoji(randDices[1], dices);
		let result3 = convertEmoji(randDices[2], dices);
		let lastResult = await message.channel.send(loadEmoji + ' ' + loadEmoji + ' ' + loadEmoji);
		await wait(1111);
		await lastResult.edit(result1 + ' ' + loadEmoji + ' ' + loadEmoji);
		await wait(2222);
		await lastResult.edit(result1 + ' ' + loadEmoji + ' ' + result3);
		await wait(3333);
		let total = randDices[0] + randDices[1] + randDices[2] + 3;
		switch (true) {
			case total < 11 && total % 2 === 0:
				return await Promise.all([
					lastResult.edit(result1 + ' ' + result2 + ' ' + result3),
					send(
						message,
						t('commands/taixiu:xiuchan', {
							amount: total
						})
					)
				]);
			case total < 11 && total % 2 === 1:
				return await Promise.all([
					lastResult.edit(result1 + ' ' + result2 + ' ' + result3),
					send(
						message,
						t('commands/taixiu:xiule', {
							amount: total
						})
					)
				]);
			case total > 10 && total % 2 === 0:
				return await Promise.all([
					lastResult.edit(result1 + ' ' + result2 + ' ' + result3),
					send(
						message,
						t('commands/taixiu:taichan', {
							amount: total
						})
					)
				]);
			case total > 10 && total % 2 === 1:
				return await Promise.all([
					lastResult.edit(result1 + ' ' + result2 + ' ' + result3),
					send(
						message,
						t('commands/taixiu:taile', {
							amount: total
						})
					)
				]);
		}
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		let userInfo = await this.container.client.db.fetchUser(interaction.user.id);
		return await interaction.reply('none');
		// return await this.mainProcess(
		// 	Number(interaction.options.getInteger('betmoney')),
		// 	interaction,
		// 	t,
		// 	userInfo,
		// 	interaction.user.id,
		// 	interaction.user.tag
		// );
	}
}

function convertEmoji(x, dices) {
	if (x == 0) return dices.one;
	if (x == 1) return dices.two;
	if (x == 2) return dices.three;
	if (x == 3) return dices.four;
	if (x == 4) return dices.five;
	if (x == 5) return dices.six;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('taixiu')
		.setDescription('Game Tai Xiu')
		.addIntegerOption((option) => option.setName('betmoney').setDescription('Enter an integer').setRequired(true)),
	UserCommand
};
