var Markup = require('telegraf').Markup;
var getLang = require('../utils/userLang').getLang;
var setLang = require('../utils/userLang').setLang;
var t = require('../locales').t;
var getWebAppUrl = require('../utils/env').getWebAppUrl;
var buildStartKeyboard = require('../commands/start').buildKeyboard;

/**
 * Wires up the "Change language" flow triggered from /start's inline
 * keyboard: tapping it shows 3 language buttons, tapping one of those
 * updates the per-chat language preference (see utils/userLang.js) and
 * re-sends the start message translated into that language.
 */
function registerCallbackHandlers(bot) {
  bot.action('change_language', function (ctx) {
    var chatId = ctx.chat.id;
    var strings = t(getLang(chatId));

    return ctx.editMessageText(
      strings.chooseLanguage,
      Markup.inlineKeyboard([
        [Markup.button.callback('\uD83C\uDDFA\uD83C\uDDFF O\'zbekcha', 'set_lang_uz')],
        [Markup.button.callback('\uD83C\uDDF7\uD83C\uDDFA \u0420\u0443\u0441\u0441\u043A\u0438\u0439', 'set_lang_ru')],
        [Markup.button.callback('\uD83C\uDDEC\uD83C\uDDE7 English', 'set_lang_en')]
      ])
    )
      .then(function () { return ctx.answerCbQuery(); })
      .catch(function () { return ctx.answerCbQuery(); });
  });

  ['uz', 'ru', 'en'].forEach(function (lang) {
    bot.action('set_lang_' + lang, function (ctx) {
      var chatId = ctx.chat.id;
      setLang(chatId, lang);

      var strings = t(lang);
      var webAppUrl = getWebAppUrl();

      return ctx.editMessageText(strings.languageChanged, buildStartKeyboard(lang, webAppUrl))
        .then(function () { return ctx.answerCbQuery(); })
        .catch(function () { return ctx.answerCbQuery(); });
    });
  });
}

module.exports = registerCallbackHandlers;
