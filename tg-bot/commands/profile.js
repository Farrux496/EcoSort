var getLang = require('../utils/userLang').getLang;
var t = require('../locales').t;

module.exports = function profileCommand(ctx) {
  var chatId = ctx.chat && ctx.chat.id;
  var strings = t(getLang(chatId));

  var user = ctx.from || {};
  var fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || strings.notSet;

  var lines = [
    strings.profileTitle,
    '',
    strings.profileName + fullName,
    strings.profileUsername + (user.username ? '@' + user.username : strings.notSet),
    strings.profileLanguage + (user.language_code || strings.notSet),
    strings.profileId + (user.id !== undefined ? user.id : strings.notSet),
    '',
    strings.profileNote
  ];

  return ctx.reply(lines.join('\n'));
};
