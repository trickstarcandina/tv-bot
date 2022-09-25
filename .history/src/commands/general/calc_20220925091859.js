//const { MessageActionRow, MessageButton } = require('discord.js');
const { evaluate } = require('mathjs');
const { generateComponents } = require('../../lib/utils');

class UserCommand extends WynnCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'calc',
            aliases: ['tc', 'tcalculator'],
            description: 'commands/calc:description',
            usage: 'commands/calc:usage',
            //cooldownDelay: 5000
        });
    }
    async messageRun(message) {
        let data = '';
        let content = '';

        const components = generateComponents();

        message.reply({ content: '```fix\n ```', components });
        //const message = await message.fetchReply();

        const filter = (x) => x.member.id === message.member.id;
        const collector = message.createMessageComponentCollector(filter, { time: 10e3 });

        collector.on('collect', (x) => {
            const value = x.customID;

            switch (value) {
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
                        content = 'commands/calc:error';
                        data = '';
                    }
                    break;
                default:
                    data += value;
                    content = '```fix\n' + data + '```';
                    break;
            }

            collector.resetTimer();
            x.update({ content, components });
        });
        collector.on('end',  (collected) => {
            message.edit({
                content: content + 'commands/calc:endseasion',
            });
        });
    }
}