const giveawaySchema = require('../schema/giveaways');
const giveawayModel = mongoose.model('giveaways', giveawaySchema);

const { GiveawaysManager } = require('discord-giveaways');
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
        return await giveawayModel.find().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData) {
        await giveawayModel.create(giveawayData);
        return true;
    }

    async editGiveaway(messageId, giveawayData) {
        await giveawayModel.updateOne({ messageId }, giveawayData).exec();
        return true;
    }

    async deleteGiveaway(messageId) {
        await giveawayModel.deleteOne({ messageId }).exec();
        return true;
    }
};
module.exports = GiveawayManagerWithOwnDatabase;

module.exports.getAllGiveaways = async function () {
	return await getAllGiveaways();
};
module.exports.saveGiveaway = async function (messageId, giveawayData) {
    return await saveGiveaway(messageId, giveawayData);
};
module.exports.editGiveaway = async function (messageId, giveawayData) {
	return await editGiveaway(messageId, giveawayData);
};
module.exports.deleteGiveaway = async (messageId) => await deleteGiveaway(messageId);