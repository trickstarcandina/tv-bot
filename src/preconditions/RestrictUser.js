const { err, ok, Precondition, UserError } = require('@sapphire/framework');
const reminderCaptcha = require('../utils/humanVerify/reminderCaptcha');

module.exports = class ClientPrecondition extends Precondition {
	async run(message) {
		let isBlock = await this.container.client.db.checkIsBlock(message.author.id);
		if (isBlock === true) return err(new UserError({ identifier: 'RestrictUser' }));
		if (this.container.client.options.spams.get(`${message.author.id}`) === 'warn' || (isBlock.length > 0 && !isBlock[0].isResolve)) {
			await reminderCaptcha(message, this.container.client, message.author.id, message.author.tag);
			return err(new UserError({ identifier: 'RestrictUser' }));
		}
		return ok();
	}
};
