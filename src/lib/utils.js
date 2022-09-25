const { send } = require('@sapphire/plugin-editable-commands');
const { MessageEmbed } = require('discord.js');
const { RandomLoadingMessage } = require('./constants');
const { MessageActionRow, MessageButton } = require('discord.js');

function pickRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function sendLoadingMessage(message) {
	return send(message, { embeds: [new MessageEmbed().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
}

async function returnContentForSlashOrSendMessage(message, content) {
	if (message.type === 'APPLICATION_COMMAND') {
		return content;
	}
	return await send(message, content);
}

async function returnSlashAndMessage(message, content) {
	if (message.type === 'APPLICATION_COMMAND') {
		return await message.reply(content);
	}
	return await send(message, content);
}

function smallNumberDisplay(count, digits) {
	const numbers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
	var result = '';
	for (i = 0; i < digits; i++) {
		var digit = count % 10;
		count = Math.trunc(count / 10);
		result = numbers[digit] + result;
	}
	return result;
}

// async function sendCaptcha(image, message, content) {
// 	if (message.type === 'APPLICATION_COMMAND') {
// 		return await message.reply({
// 			embeds: [
// 				new MessageEmbed()
// 					.setTitle('⚠ CAPTCHA ⚠ CAPTCHA ⚠ CAPTCHA')
// 					.setDescription(content)
// 					.setColor('#FF0000')
// 					.setImage('attachment://captcha.png')
// 			],
// 			files: [{ name: 'captcha.png', attachment: image }]
// 		});
// 	}
// 	return await send(message, {
// 		embeds: [
// 			new MessageEmbed()
// 				.setTitle('⚠ CAPTCHA ⚠ CAPTCHA ⚠ CAPTCHA')
// 				.setDescription(content)
// 				.setColor('#FF0000')
// 				.setImage('attachment://captcha.png')
// 		],
// 		files: [{ name: 'captcha.png', attachment: image }]
// 	});
// }

async function sendCaptchaImage(userId, client, image, text, message, content) {
	client.options.spams.set(`${userId}`, 'warn');
	await client.db.updateCaptcha(userId, {
		discordId: userId,
		captcha: text,
		deadline: new Date(Date.now() + 600000),
		isResolve: false
	});
	if (message.type === 'APPLICATION_COMMAND') {
		return await message.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('⚠ CAPTCHA ⚠ CAPTCHA ⚠ CAPTCHA')
					.setDescription(content)
					.setColor('#FF0000')
					.setImage('attachment://captcha.png')
			],
			files: [{ name: 'captcha.png', attachment: image }]
		});
	}
	return await send(message, {
		embeds: [
			new MessageEmbed()
				.setTitle('⚠ CAPTCHA ⚠ CAPTCHA ⚠ CAPTCHA')
				.setDescription(content)
				.setColor('#FF0000')
				.setImage('attachment://captcha.png')
		],
		files: [{ name: 'captcha.png', attachment: image }]
	});
}

function getKeyByValueMap(map, searchValue) {
	for (let [key, value] of map.entries()) {
		if (value === searchValue) return key;
	}
}

function generateComponents() {
	const row1 = new MessageActionRow().addComponents(
		new MessageButton().setCustomId('clear').setLabel('C').setStyle('DANGER'),
		new MessageButton().setCustomId('(').setLabel('(').setStyle('PRIMARY'),
		new MessageButton().setCustomId(')').setLabel(')').setStyle('PRIMARY'),
		new MessageButton().setCustomId('^').setLabel('^').setStyle('PRIMARY')
	);
	const row2 = new MessageActionRow().addComponents(
		new MessageButton().setCustomId('7').setLabel('7').setStyle('SECONDARY'),
		new MessageButton().setCustomId('8').setLabel('8').setStyle('SECONDARY'),
		new MessageButton().setCustomId('9').setLabel('9').setStyle('SECONDARY'),
		new MessageButton().setCustomId('/').setLabel('/').setStyle('PRIMARY')
	);
	const row3 = new MessageActionRow().addComponents(
		new MessageButton().setCustomId('4').setLabel('4').setStyle('SECONDARY'),
		new MessageButton().setCustomId('5').setLabel('5').setStyle('SECONDARY'),
		new MessageButton().setCustomId('6').setLabel('6').setStyle('SECONDARY'),
		new MessageButton().setCustomId('*').setLabel('*').setStyle('PRIMARY')
	);
	const row4 = new MessageActionRow().addComponents(
		new MessageButton().setCustomId('1').setLabel('1').setStyle('SECONDARY'),
		new MessageButton().setCustomId('2').setLabel('2').setStyle('SECONDARY'),
		new MessageButton().setCustomId('3').setLabel('3').setStyle('SECONDARY'),
		new MessageButton().setCustomId('-').setLabel('-').setStyle('PRIMARY')
	);
	const row5 = new MessageActionRow().addComponents(
		new MessageButton().setCustomId('0').setLabel('0').setStyle('SECONDARY'),
		new MessageButton().setCustomId('.').setLabel('.').setStyle('SECONDARY'),
		new MessageButton().setCustomId('=').setLabel('=').setStyle('SUCCESS'),
		new MessageButton().setCustomId('+').setLabel('+').setStyle('PRIMARY')
	);
	return [row1, row2, row3, row4, row5];
}

module.exports.pickRandom = pickRandom;
module.exports.sendLoadingMessage = sendLoadingMessage;
module.exports.returnContentForSlashOrSendMessage = returnContentForSlashOrSendMessage;
module.exports.returnSlashAndMessage = returnSlashAndMessage;
module.exports.smallNumberDisplay = smallNumberDisplay;
module.exports.sendCaptchaImage = sendCaptchaImage;
module.exports.getKeyByValueMap = getKeyByValueMap;
module.exports.generateComponents = generateComponents;
