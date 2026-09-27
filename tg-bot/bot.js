/**
 * EcoSort — Telegram Bot (Phase 10)
 *
 * Minimum commands per spec section 12: /start, /help, /app, /profile.
 * Main flow: Telegram User -> /start -> Open Mini App -> TELEGRAM_WEBAPP_URL
 *
 * On launch, the bot also programmatically sets its description (shown to
 * users BEFORE they tap Start) and its command-menu descriptions via the
 * Bot API, so a person opening the bot for the first time immediately sees
 * what EcoSort is for - not just a blank chat with a Start button.
 *
 * SECURITY (spec section 9): the bot token is read ONLY from the
 * TELEGRAM_BOT_TOKEN environment variable. It is never hardcoded, logged,
 * or embedded in any file that could end up in frontend code or Git.
 */
require('dotenv').config();

var Telegraf = require('telegraf').Telegraf;
var startCommand = require('./commands/start');
var helpCommand = require('./commands/help');
var appCommand = require('./commands/app');
var profileCommand = require('./commands/profile');
var adminCommand = require('./commands/admin');
var registerCallbackHandlers = require('./handlers/callbackHandler');
var registerTextHandler = require('./handlers/textHandler');
var errorHandler = require('./handlers/errorHandler');
var locales = require('./locales');

var BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error(
    '[ecosort-bot] Missing TELEGRAM_BOT_TOKEN environment variable.\n' +
    'Copy .env.example to .env in tg-bot/ and set your bot token before starting.'
  );
  process.exit(1);
}

var bot = new Telegraf(BOT_TOKEN);

bot.command('start', startCommand);
bot.command('help', helpCommand);
bot.command('app', appCommand);
bot.command('profile', profileCommand);
bot.command('admin', adminCommand);

registerCallbackHandlers(bot);
// Must be registered AFTER all bot.command() calls above: Telegraf routes
// "/command" text through the matching bot.command() handler first, and
// only unmatched plain text (or an unrecognized "/xyz") reaches this
// generic handler - which is what lets it safely catch the admin password
// reply without swallowing real commands.
registerTextHandler(bot);

bot.catch(errorHandler);

// Sets the description shown to a user BEFORE they press Start, and the
// short description shown in search results / the bot's profile card.
// Uzbek is used as the default/primary language (see locales.js); this can
// be extended to setMyDescription({..., language_code: 'ru'}) etc. later
// if per-language BotFather-style descriptions are needed.
function setBotProfileText() {
  var strings = locales.t(locales.DEFAULT_LANG);
  return Promise.all([
    bot.telegram.setMyDescription(strings.description).catch(function (err) {
      console.warn('[ecosort-bot] could not set description:', err.message);
    }),
    bot.telegram.setMyShortDescription(strings.shortDescription).catch(function (err) {
      console.warn('[ecosort-bot] could not set short description:', err.message);
    }),
    bot.telegram.setMyCommands([
      { command: 'start', description: 'Open EcoSort / restart' },
      { command: 'app', description: 'Open the Mini App' },
      { command: 'profile', description: 'View your Telegram profile' },
      { command: 'help', description: 'Show help' }
    ]).catch(function (err) {
      console.warn('[ecosort-bot] could not set command menu:', err.message);
    })
  ]);
}

setBotProfileText()
  .then(function () {
    return bot.launch();
  })
  .then(function () {
    console.log('[ecosort-bot] Bot started successfully (long polling).');
  })
  .catch(function (err) {
    console.error('[ecosort-bot] Failed to start bot:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', function () { bot.stop('SIGINT'); });
process.once('SIGTERM', function () { bot.stop('SIGTERM'); });
