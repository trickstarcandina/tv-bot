const { Events, Listener } = require('@sapphire/framework');
const { fetchT } = require('@sapphire/plugin-i18next');

class UserEvent extends Listener {
	constructor(context) {
		super(context, { event: Events.CommandRun });
	}

	async run(message) {
		const t = await fetchT(message);
		await this.container.client.checkMarco(message, message.author.id, message.author.tag, this.name, t);
	}
}

exports.UserEvent = UserEvent;
