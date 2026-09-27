var Markup = require('telegraf').Markup;
var getLang = require('../utils/userLang').getLang;
var t = require('../locales').t;
var getWebAppUrl = require('../utils/env').getWebAppUrl;
var adminAuth = require('../utils/adminAuth');

/**
 * Registers a plain-text message handler. Right now its only job is to
 * catch the password reply after /admin (see commands/admin.js). If the
 * chat isn't waiting for a password, incoming text is ignored - this bot
 * doesn't do free-form command parsing.
 */
function registerTextHandler(bot) {
  bot.on('text', function (ctx) {
    var chatId = ctx.chat && ctx.chat.id;
    if (!chatId || !adminAuth.isAwaitingPassword(chatId)) {
      return; // not in a password-entry flow - ignore
    }

    var strings = t(getLang(chatId));
    var password = ctx.message.text.trim();

    if (!adminAuth.checkPassword(password)) {
      return ctx.reply(strings.adminWrongPassword);
    }

    adminAuth.clearAwaiting(chatId);

    var webAppUrl = getWebAppUrl();
    if (!webAppUrl) {
      return ctx.reply(strings.adminNotConfigured);
    }

    // The mini-app is now a single-page React app (see /mini-app), so there
    // is no separate admin.html - instead we pass ?admin=1, which the app
    // reads on load (src/services/telegram.ts) to elevate the Telegram
    // user to the admin role for this session. Same demo-only caveat as
    // before: this is not secure, just a convenience gate for the MVP.
    var adminUrl = webAppUrl.replace(/\/?$/, '/') + '?admin=1';

    return ctx.reply(
      strings.adminGranted,
      Markup.inlineKeyboard([
        Markup.button.webApp(strings.adminOpenPanel, adminUrl)
      ])
    );
  });
}

module.exports = registerTextHandler;
