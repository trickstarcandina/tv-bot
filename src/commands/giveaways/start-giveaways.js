const { send } = require('@sapphire/plugin-editable-commands');
const { fetchT } = require('@sapphire/plugin-i18next');
const { MessageEmbed } = require('discord.js');
const WynnCommand = require('../../lib/Structures/WynnCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');

class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'startgiveaways',
			aliases: ['startga', 'tga'],
			description: '',
			usage: '',
			example: ''
			//cooldownDelay: 5000
		});
	}
    async messageRun (client, message, args) {

        if(!message.member.permissions.has('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
            return message.reply({
                content: '',
                ephemeral: true
            });
        }
    
        const giveawayChannel = null;
        const giveawayDuration = null;
        const giveawayWinnerCount = null;
        const giveawayPrize = null;
        
        if(!giveawayChannel.isTextBased()) {
            return message.reply({
                content: '',
                ephemeral: true
            });
        }
    
        client.giveawaysManager.start(giveawayChannel, {
            duration: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: giveawayWinnerCount,
            hostedBy: client.config.hostedBy ? message.user : null,
            messages
        });
    
        return await utils.returnContentForSlashOrSendMessage(message, t('commands/startgiveaways:start', { channel: giveawayChannel }));
    
    } 

}