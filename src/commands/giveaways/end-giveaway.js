class UserCommand extends WynnCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'endgiveaways',
			aliases: ['endga', 'ega'],
			description: '',
			usage: '',
			example: ''
			//cooldownDelay: 5000
		});
	}
}