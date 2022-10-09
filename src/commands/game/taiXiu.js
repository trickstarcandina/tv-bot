const WynnCommand = require('../../lib/Structures/WynnCommand');
const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const logger = require('../../utils/logger');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utils = require('../../lib/utils');
const wait = require('node:timers/promises').setTimeout;

const game = require('../../config/game');
const emoji = require('../../config/emoji');
const coolDown = require('../../config/cooldown');
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

const reminderCaptcha = require('../../utils/humanVerify/reminderCaptcha');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'taixiu',
			aliases: ['tx', 'taixiu'],
			description: 'commands/taixiu:description',
			usage: 'commands/taixiu:usage',
			example: 'commands/taixiu:example'
			// cooldownDelay: 25000
		});
	}

	async messageRun(message, args) {
		let isBlock = await this.container.client.db.checkIsBlock(message.author.id);
		if (isBlock === true) return;
		if (this.container.client.options.spams.get(`${message.author.id}`) === 'warn' || (isBlock.length > 0 && !isBlock[0].isResolve)) {
			return await reminderCaptcha(message, this.container.client, message.author.id, message.author.tag);
		}
		const t = await fetchT(message);
		const checkCoolDown = await this.container.client.checkTimeCoolDown(message.author.id, this.name, coolDown.game.baucua, t);
		if (checkCoolDown) {
			return send(message, checkCoolDown);
		}
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
		let lastResult = await send(message, loadEmoji + ' ' + loadEmoji + ' ' + loadEmoji);
		await wait(1111);
		await lastResult.edit(result1 + ' ' + loadEmoji + ' ' + loadEmoji);
		await wait(2222);
		await lastResult.edit(result1 + ' ' + loadEmoji + ' ' + result3);
		await wait(3333);
		let total = randDices[0] + randDices[1] + randDices[2] + 3;
		const lastTextReturn =
			': ' +
			total +
			'\n       ' +
			result1 +
			' ' +
			result2 +
			' ' +
			result3 +
			'\n' +
			'**' +
			convertName(randDices[0]) +
			' ✧ ' +
			convertName(randDices[1]) +
			' ✧ ' +
			convertName(randDices[2]) +
			'**';
		switch (true) {
			case total < 11 && total % 2 === 0:
				return await lastResult.edit(
					t('commands/taixiu:xiuchan', {
						amount: lastTextReturn
					})
				);
			case total < 11 && total % 2 === 1:
				return await lastResult.edit(
					t('commands/taixiu:xiule', {
						amount: lastTextReturn
					})
				);
			case total > 10 && total % 2 === 0:
				return await lastResult.edit(
					t('commands/taixiu:taichan', {
						amount: lastTextReturn
					})
				);
			case total > 10 && total % 2 === 1:
				return await lastResult.edit(
					t('commands/taixiu:taile', {
						amount: lastTextReturn
					})
				);
		}
	}

	async execute(interaction) {
		let isBlock = await this.container.client.db.checkIsBlock(interaction.user.id);
		if (isBlock === true) return;
		if (this.container.client.options.spams.get(`${interaction.user.id}`) === 'warn' || (isBlock.length > 0 && !isBlock[0].isResolve)) {
			return await reminderCaptcha(interaction, this.container.client, interaction.user.id, interaction.user.tag);
		}
		const t = await fetchT(interaction);
		const checkCoolDown = await this.container.client.checkTimeCoolDown(interaction.user.id, this.name, coolDown.game.baucua, t);
		if (checkCoolDown) {
			return await interaction.reply(checkCoolDown);
		}
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

function convertName(x) {
	switch (x) {
		case 0:
			return 'Một';
		case 1:
			return 'Hai';
		case 2:
			return 'Ba';
		case 3:
			return 'Bốn';
		case 4:
			return 'Năm';
		case 5:
			return 'Sáu';
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('taixiu')
		.setDescription('Game Tai Xiu')
		.addIntegerOption((option) => option.setName('betmoney').setDescription('Enter an integer').setRequired(true)),
	UserCommand
};
