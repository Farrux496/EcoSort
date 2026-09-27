var Markup = require('telegraf').Markup;
var getWebAppUrl = require('../utils/env').getWebAppUrl;
var getLang = require('../utils/userLang').getLang;
var t = require('../locales').t;

function buildKeyboard(lang, webAppUrl) {
  var strings = t(lang);
  var rows = [];

  if (webAppUrl) {
    // The mini-app is a single-page app now (see /mini-app) - there is no
    // separate wallet.html to deep-link to, the wallet is just a screen
    // inside the app - so we only show the one "open app" button.
    rows.push([Markup.button.webApp(strings.openApp, webAppUrl)]);
  }

  rows.push([Markup.button.callback(strings.changeLanguage, 'change_language')]);

  return Markup.inlineKeyboard(rows);
}

module.exports = function startCommand(ctx) {
  var chatId = ctx.chat && ctx.chat.id;
  var lang = getLang(chatId);
  var strings = t(lang);
  var webAppUrl = getWebAppUrl();

  var firstName = (ctx.from && ctx.from.first_name) || '';
  var greeting = firstName ? strings.welcomeWithName(firstName) : strings.welcomeNoName;

  var message = greeting + '\n\n' + strings.startBody;

  if (!webAppUrl) {
    message += '\n\n(' + strings.appNotConfigured + ')';
  }

  return ctx.reply(message, buildKeyboard(lang, webAppUrl));
};

module.exports.buildKeyboard = buildKeyboard;
