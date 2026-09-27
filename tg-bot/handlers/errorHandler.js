/**
 * Global error handler, registered via bot.catch() in bot.js.
 * Per spec section 42: user-facing errors must be understandable, never a
 * raw stack trace. Technical details are logged server-side only.
 */
module.exports = function errorHandler(err, ctx) {
  var updateId = ctx && ctx.update ? ctx.update.update_id : 'unknown';
  console.error('[ecosort-bot] Error while handling update ' + updateId + ':', err);

  if (ctx && typeof ctx.reply === 'function') {
    ctx.reply("Something went wrong. Please try again in a moment.").catch(function () {
      // If even the error reply fails (e.g. user blocked the bot), there's
      // nothing more we can do - just avoid throwing from inside the
      // error handler itself.
    });
  }
};
