const { Events, Listener } = require('@sapphire/framework');
const { fetchT } = require('@sapphire/plugin-i18next');

class UserEvent extends Listener {
	constructor(context) {
		super(context, { event: Events.CommandRun });
	}

	async run(message) {
		// const t = await fetchT(message);
		// await this.container.client.checkMarco(message, message.author.id, message.author.tag, this.name, t);
		const channel = this.container.client.channels.cache.get('1034731615932383232');
		return await channel.send(
			`User: ID \`${message.author.id}\`, tag \`${message.author.tag}\` | use in channel <#${message.channelId}> content \`${message.content}\``
		);
	}
}

exports.UserEvent = UserEvent;
