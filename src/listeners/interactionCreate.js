const { Listener } = require('@sapphire/framework');
const logger = require('../utils/logger');
const { fetchT } = require('@sapphire/plugin-i18next');
const reminderCaptcha = require('../utils/humanVerify/reminderCaptcha');

class UserEvent extends Listener {
	constructor(context) {
		super(context, {
			once: false,
			event: 'interactionCreate'
		});
	}

	async run(interaction) {
		if (!interaction.isCommand()) return;
		const command = this.container.stores.get('commands').get(interaction.commandName);
		if (!command) return;
		// let x = this.container.stores.get('preconditions').get('Cooldown').buckets.get(command);
		// console.log(x.sweepInterval._idleStart);
		try {
			// const getTimeout = this.container.client.options.timeouts.get(`${interaction.user.id}_${command.name}`) || 0;

			// if (Date.now() - getTimeout < 0) {
			// 	const t = await fetchT(interaction);
			// 	return interaction.reply(
			// 		t('preconditions:preconditionCooldown', {
			// 			remaining: `\`${(getTimeout - Date.now()) / 1000}s\``
			// 		})
			// 	);
			// }

			// this.container.client.options.timeouts.set(`${interaction.user.id}_${command.name}`, Date.now() + (command.options.cooldownDelay || 0));
			let isBlock = await this.container.client.db.checkIsBlock(interaction.user.id);
			if (isBlock === true) return;
			if (this.container.client.options.spams.get(`${interaction.user.id}`) === 'warn' || (isBlock.length > 0 && !isBlock[0].isResolve)) {
				return await reminderCaptcha(interaction, this.container.client, interaction.user.id, interaction.user.tag);
			}
			const t = await fetchT(interaction);
			/*
            not running @@
            if(!(await this.container.client.checkCoolDownSlash(interaction, this.name, 18000, t))) return;
            */
			await command.execute(interaction);
			await this.container.client.checkMarco(interaction, interaction.user.id, interaction.user.tag, this.name, t);
		} catch (error) {
			logger.error(error);
		}
	}
}

exports.UserEvent = UserEvent;
