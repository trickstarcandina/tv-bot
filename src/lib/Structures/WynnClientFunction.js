const { container } = require('@sapphire/framework');
const { createCaptcha } = require('../../utils/index');
const utils = require('../../lib/utils');

module.exports.fetchPrefix = async function fetchPrefix(message) {
	if (message.guild === null) return process.env.PREFIX;
	const guild = await this.db.fetchGuild(message.guild.id);
	return guild.prefix;
};

module.exports.checkMarco = async function checkMarco(message, id, tag, name, t) {
	// let dateNow = Date.now();
	if (process.env.MOD_IDS.split(',').includes(id) || process.env.OWNER_IDS.split(',').includes(id)) {
		return;
	}
	//spamTime
	/*
	let spamTime = container.client.options.spamTime.get(`${id}_${name}`);
	if (spamTime !== undefined) {
		// check
		let arraySpamTime = spamTime.split('_');
		if (arraySpamTime.length > 9) {
			let subRequest = Number(arraySpamTime[2]) - Number(arraySpamTime[1]);
			let point = 0;
			for (let i = 2; i < arraySpamTime.length - 1; i++) {
				if (Math.abs(Number(arraySpamTime[i + 1]) - Number(arraySpamTime[i]) - subRequest) < 2000) {
					point++;
				}
			}
			if (point > 5) {
				let captcha = await createCaptcha(true);
				return await utils.sendCaptchaImage(
					id,
					container.client,
					captcha.image,
					captcha.text,
					message,
					t('commands/captcha:require', {
						user: tag
					})
				);
			}
		}
	}
	container.client.options.spamTime.set(`${id}_${name}`, spamTime + '_' + dateNow.toString());
	*/
	//spams
	let countSpam = container.client.options.spams.get(`${id}`) || 0;
	if (countSpam > 68) {
		//sent captcha
		let captcha = await createCaptcha(true);
		return await utils.sendCaptchaImage(
			id,
			container.client,
			captcha.image,
			captcha.text,
			message,
			t('commands/captcha:require', {
				user: tag
			})
		);
	} else {
		countSpam++;
		container.client.options.spams.set(`${id}`, countSpam);
	}
};

// deprecated
/*
module.exports.checkTimeCoolDown = async function checkTimeCoolDown(id, name, delay, t) {
	if (process.env.OWNER_IDS.split(',').includes(id)) {
		return;
	}
	const getTimeout = container.client.options.timeouts.get(`${id}_${name}`) || 0;
	if (Date.now() - getTimeout < 0) {
		return utils.returnSlashAndMessage(
			message,
			t('preconditions:preconditionCooldown', {
				remaining: `\`${(getTimeout - Date.now()) / 1000}s\``
			})
		);
	}
	container.client.options.timeouts.set(`${id}_${name}`, Date.now() + (delay || 0));
};
*/

module.exports.checkCoolDownSlash = async function checkCoolDownSlash(interaction, name, delay, t) {
	if (process.env.OWNER_IDS.split(',').includes(interaction.user.id)) {
		return;
	}
	let dateNow = Date.now();
	//timeout cooldown
	const getTimeout = container.client.options.timeouts.get(`${interaction.user.id}_${name}`) || 0;
	if (dateNow - getTimeout < 0) {
		return await interaction.reply(
			t('preconditions:preconditionCooldown', {
				remaining: `\`${(getTimeout - dateNow) / 1000}s\``
			})
		);
	}
	container.client.options.timeouts.set(`${interaction.user.id}_${name}`, dateNow + (delay || 0));
};

module.exports.resetCooldown = async function resetCooldown(idUser, command) {
	let mapCooldown = container.stores.get('preconditions').get('Cooldown').buckets.get(command);
	let valueOfCooldown = mapCooldown.get(idUser);
	valueOfCooldown.expires = Date.now() + 5000;
	return mapCooldown.set(idUser, valueOfCooldown);
	// console.log(mapCooldown.get('662508642251309057'));
};

module.exports.setCustomCooldown = async function setCustomCooldown(id, name, time) {
	return container.client.options.timeouts.set(`${id}_${name}`, Date.now() + time);
};

module.exports.resetCustomCooldown = async function resetCustomCooldown(id, name) {
	return container.client.options.timeouts.set(`${id}_${name}`, Date.now() + 8000);
};

module.exports.loadArrayLottery = async function loadArrayLottery() {
	const arrayLottery = await this.db.loadArrayLottery();
	//server go off load backup
	for (let i = 0; i < arrayLottery.length; i++) {
		if (arrayLottery[i].arrayBackup.length > 0) {
			container.client.options.lottery.push(arrayLottery[i].arrayBackup);
		} else {
			container.client.options.lottery.push(arrayLottery[i].arrayInit);
		}
	}
};

module.exports.setArrayLottery = async function setArrayLottery(arrayType2, arrayType3, arrayType4, arrayType5) {
	container.client.options.lottery = [];
	container.client.options.lottery.push(arrayType2);
	container.client.options.lottery.push(arrayType3);
	container.client.options.lottery.push(arrayType4);
	container.client.options.lottery.push(arrayType5);
};
