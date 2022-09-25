const { evaluate } = require('mathjs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const WynnCommand = require('../../lib/Structures/WynnCommand');
const { generateComponents } = require('../../lib/utils');
const { send } = require('@sapphire/plugin-editable-commands');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'calc',
			aliases: ['calc', 'calculator'],
			description: 'commands/calc:description',
			usage: 'commands/calc:usage',
			example: 'commands/calc:example'
			//cooldownDelay: 5000
		});
	}
	async messageRun(message) {
		let data = '';
		let content = '';

		const components = generateComponents();

		let newMsg = await send(message, { content: '```fix\n ```', components: components });
		// message.reply({ content: '```fix\n ```', components });

		const filter = (x) => x.member.id === message.member.id;
		const collector = newMsg.createMessageComponentCollector(filter, { time: 10e3 });

		collector.on('collect', async (message) => {
			switch (message.customId) {
				case 'clear':
					data = '';
					content = '```fix\n ```';
					break;
				case '=':
					try {
						const res = evaluate(data);
						content = `\`\`\`fix\n${data}\n= ${res}\`\`\``;
						data = res + '';
					} catch (e) {
						console.error(e);
						// use t // const t = await fetchT(message);
						content = 'commands/calc:error';
						data = '';
					}
					break;
				default:
					data += message.customId;
					content = '```fix\n' + data + '```';
					break;
			}

			collector.resetTimer();
			await message.update({ content, components });
		});
		collector.on('end', async (collected) => {
			await newMsg.edit({
				// use t // const t = await fetchT(message);
				content: content + 'commands/calc:endseasion'
			});
		});
	}

	async mainprocess() {
		// viết hàm xử lý logic của cả messageRun và execute ở đây nhé
	}

	async execute(interaction) {
		const t = await fetchT(interaction);
		let userInfo = await this.container.client.db.fetchUser(interaction.user.id);
		return await interaction.reply('none');
		// return mainprocess()
	}
}

module.exports = {
	// viết thêm tham số nếu cần
	data: new SlashCommandBuilder().setName('calc').setDescription('Calculator 📱'),
	UserCommand
};
