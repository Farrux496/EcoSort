var getLang = require('../utils/userLang').getLang;
var t = require('../locales').t;

module.exports = function helpCommand(ctx) {
  var chatId = ctx.chat && ctx.chat.id;
  var strings = t(getLang(chatId));

  var message = strings.helpTitle + '\n\n' + strings.helpBody;

  return ctx.reply(message);
};
