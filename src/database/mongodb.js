const { fetchGuild, updateGuild } = require('./query/guild');
module.exports.fetchGuild = fetchGuild;
module.exports.updateGuild = updateGuild;
/* User */
const { fetchUser, updateUser, checkExistUser, transactionItemUser, upsertUser, updateListWinner } = require('./query/user');
module.exports.fetchUser = fetchUser;
module.exports.updateUser = updateUser;
module.exports.checkExistUser = checkExistUser;
module.exports.transactionItemUser = transactionItemUser;
module.exports.upsertUser = upsertUser;
module.exports.updateListWinner = updateListWinner;
/* Daily */
const { getDailyInfo, setDailyInfo } = require('./query/daily');
module.exports.getDailyInfo = getDailyInfo;
module.exports.setDailyInfo = setDailyInfo;
/* Lottery */
const {
	clearLotteryArray,
	initLottery,
	loadArrayLottery,
	saveArrayLottery,
	getLotteryResult,
	getLastResultLottery,
	getLotteryResultByType,
	updateCountLotteryResult,
	updateLotteryResult,
	createNewLottery,
	getListWiner,
	clearLotteryUser,
	findAllLotteryByDiscordId
} = require('./query/lottery');
module.exports.clearLotteryArray = clearLotteryArray;
module.exports.initLottery = initLottery;
module.exports.loadArrayLottery = loadArrayLottery;
module.exports.saveArrayLottery = saveArrayLottery;
module.exports.getLotteryResult = getLotteryResult;
module.exports.getLastResultLottery = getLastResultLottery;
module.exports.getLotteryResultByType = getLotteryResultByType;
module.exports.updateCountLotteryResult = updateCountLotteryResult;
module.exports.updateLotteryResult = updateLotteryResult;
module.exports.createNewLottery = createNewLottery;
module.exports.getListWiner = getListWiner;
module.exports.clearLotteryUser = clearLotteryUser;
module.exports.findAllLotteryByDiscordId = findAllLotteryByDiscordId;
/* Channel */
const { fetchChannel, updateChannel } = require('./query/channel');
module.exports.fetchChannel = fetchChannel;
module.exports.updateChannel = updateChannel;
/* Lucky */
const { addNewBetLucky, getAllBetLucky, clearBetLucky, findAllLuckyByDiscordId } = require('./query/lucky');
module.exports.addNewBetLucky = addNewBetLucky;
module.exports.getAllBetLucky = getAllBetLucky;
module.exports.clearBetLucky = clearBetLucky;
module.exports.findAllLuckyByDiscordId = findAllLuckyByDiscordId;
/* Captcha */
const { getCaptchaByDiscordId, updateCaptcha, checkIsBlock } = require('./query/captcha');
module.exports.getCaptchaByDiscordId = getCaptchaByDiscordId;
module.exports.updateCaptcha = updateCaptcha;
module.exports.checkIsBlock = checkIsBlock;
/* CustomRandom */
const { registerCustomRandom, findCustomRandom, updateCustomRandom } = require('./query/customRandom');
module.exports.registerCustomRandom = registerCustomRandom;
module.exports.findCustomRandom = findCustomRandom;
module.exports.updateCustomRandom = updateCustomRandom;
/* christmas2022piece */
const { getChristmasByDiscord, increaseChristmasCount, updateChristmasPiece } = require('./query/christmas2022piece');
module.exports.getChristmasByDiscord = getChristmasByDiscord;
module.exports.increaseChristmasCount = increaseChristmasCount;
module.exports.updateChristmasPiece = updateChristmasPiece;
/* VoiceInfo */
const { getVoiceInfoByDiscord, increaseTotalTime } = require('./query/voiceInfo');
module.exports.getVoiceInfoByDiscord = getVoiceInfoByDiscord;
module.exports.increaseTotalTime = increaseTotalTime;
