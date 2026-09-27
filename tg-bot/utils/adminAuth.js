/**
 * DEMO-ONLY admin password gate for the bot's /admin command.
 *
 * This intentionally uses the SAME demo password as the web admin panel
 * (web-mini-app/js/admin.js: DEMO_ADMIN_PASSWORD) for consistency, but the
 * two checks are otherwise independent - passing this one does not log
 * you into the web panel automatically, it just reveals a button that
 * opens admin.html, which asks for the password again there.
 *
 * NOT SECURE - same warning as the web panel: this is a client-side/
 * chat-side convenience for the MVP, not real access control. Real admin
 * authentication must happen server-side before production use.
 */
var ADMIN_PASSWORD = 'admin123';

var awaitingPassword = new Set();

function expectPassword(chatId) {
  awaitingPassword.add(chatId);
}

function isAwaitingPassword(chatId) {
  return awaitingPassword.has(chatId);
}

function clearAwaiting(chatId) {
  awaitingPassword.delete(chatId);
}

function checkPassword(input) {
  return input === ADMIN_PASSWORD;
}

module.exports = {
  expectPassword: expectPassword,
  isAwaitingPassword: isAwaitingPassword,
  clearAwaiting: clearAwaiting,
  checkPassword: checkPassword
};
