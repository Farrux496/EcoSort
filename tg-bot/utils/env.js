/**
 * Small env-reading helper so command files don't touch process.env directly.
 * The bot token itself is read only once, in bot.js, and is never passed
 * around or logged - see bot.js for that check.
 */

function getWebAppUrl() {
  var url = process.env.TELEGRAM_WEBAPP_URL;
  if (!url || !url.trim()) return null;
  return url.trim();
}

function getBotUsername() {
  var username = process.env.TELEGRAM_BOT_USERNAME;
  if (!username || !username.trim()) return null;
  return username.trim();
}

module.exports = {
  getWebAppUrl: getWebAppUrl,
  getBotUsername: getBotUsername
};
