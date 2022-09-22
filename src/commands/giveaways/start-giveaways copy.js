class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'rerollgiveaways',
			aliases: ['rrga', 'rrgiveaways'],
			description: '',
			usage: '',
			example: ''
			//cooldownDelay: 5000
		});
	}
}