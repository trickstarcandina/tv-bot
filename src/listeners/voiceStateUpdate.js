const { Events, Listener } = require('@sapphire/framework');

class UserEvent extends Listener {
	constructor(context) {
		super(context, { event: Events.VoiceStateUpdate });
	}

	async run(oldState, newState) {
		// silently fail owner only commands
		let newUserChannel = newState.channel;
		let oldUserChannel = oldState.channel;
		if (oldUserChannel === null && newUserChannel !== null) {
			// User Join a voice channel
			// Handle your save when user join in memcache, database , ...
			console.log('oldState' + oldState.member.user.id);
			console.log('newState' + newState.member.user.id);
		} else if (oldUserChannel !== null && newUserChannel === null) {
			// User Leave a voice channel
			// Calculate with previous save time to get in voice time
			console.log('oldState' + oldState.member.user.id);
			console.log('newState' + newState.member.user.id);
		} else if (oldUserChannel !== null && newUserChannel !== null && oldUserChannel.id != newUserChannel.id) {
			// User Switch a voice channel
			// This is bonus if you want to do something futhermore
			console.log('oldState' + oldState.member.user.id);
			console.log('newState' + newState.member.user.id);
		}
	}
}

exports.UserEvent = UserEvent;
