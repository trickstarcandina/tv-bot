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
}