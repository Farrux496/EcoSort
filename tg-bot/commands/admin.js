var getLang = require('../utils/userLang').getLang;
var t = require('../locales').t;
var expectPassword = require('../utils/adminAuth').expectPassword;

module.exports = function adminCommand(ctx) {
  var chatId = ctx.chat && ctx.chat.id;
  var strings = t(getLang(chatId));

  expectPassword(chatId);

  return ctx.reply(strings.adminAskPassword);
};
