/**
 * In-memory per-chat language preference.
 *
 * MVP LIMITATION: this is a plain in-memory Map, not a database - language
 * preference is lost when the bot process restarts. Since the bot has no
 * database yet (see tg-bot/README.md), this is the simplest thing that
 * works without over-engineering a persistence layer for a single field.
 */
var langByChatId = new Map();

var locales = require('../locales');

function getLang(chatId) {
  return langByChatId.get(chatId) || locales.DEFAULT_LANG;
}

function setLang(chatId, lang) {
  langByChatId.set(chatId, locales.normalizeLang(lang));
}

module.exports = {
  getLang: getLang,
  setLang: setLang
};
