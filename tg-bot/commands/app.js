var Markup = require('telegraf').Markup;
var getWebAppUrl = require('../utils/env').getWebAppUrl;
var getLang = require('../utils/userLang').getLang;
var t = require('../locales').t;

module.exports = function appCommand(ctx) {
  var chatId = ctx.chat && ctx.chat.id;
  var strings = t(getLang(chatId));
  var webAppUrl = getWebAppUrl();

  if (!webAppUrl) {
    return ctx.reply(strings.appNotConfigured);
  }

  return ctx.reply(
    strings.openApp + ':',
    Markup.inlineKeyboard([
      Markup.button.webApp(strings.openApp, webAppUrl)
    ])
  );
};
