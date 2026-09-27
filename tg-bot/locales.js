/**
 * EcoSort Telegram Bot — reply strings (uz / ru / en)
 *
 * This is intentionally separate from web-mini-app/locales/*.json: the bot
 * and the Mini App do not share a backend/database in this MVP (see
 * tg-bot/README.md), so each has its own small, independent translation
 * table. Default language is Uzbek.
 */

var STRINGS = {
  uz: {
    shortDescription: "EcoSort — chiqindilarni topshirib pul va mukofot ishlab topadigan bot.",
    description:
      "\u267B\uFE0F EcoSort — bu chiqindilarni (qog'oz, plastik, metall, elektron chiqindi va h.k.) topshirib, shu orqali pul ishlab topishingiz mumkin bo'lgan bot.\n\n" +
      "Chiqindingizni topshiring, ko'rib chiqilishini kuting va mukofotingizni hamyoningizda ko'ring. Bundan tashqari o'yin orqali qo'shimcha tangalar ham yig'ishingiz mumkin.\n\n" +
      "Boshlash uchun pastdagi Start tugmasini bosing.",
    welcomeWithName: function (name) { return "Salom, " + name + "! \u267B\uFE0F EcoSort'ga xush kelibsiz."; },
    welcomeNoName: "Salom! \u267B\uFE0F EcoSort'ga xush kelibsiz.",
    startBody:
      "Chiqindilaringizni (qog'oz, plastik, metall, elektron chiqindi) topshiring, mukofot oling va o'yin orqali tangalar yig'ing.\n\n" +
      "Tezkor buyruqlar:\n" +
      "/app — Ilovani ochish\n" +
      "/profile — Telegram profilingiz\n" +
      "/help — Yordam\n\n" +
      "Quyidagi tugmalardan foydalanishingiz mumkin:",
    openApp: "\uD83D\uDE80 Ilovani ochish",
    balance: "\uD83D\uDCB0 Balans",
    changeLanguage: "\uD83C\uDF10 Tilni almashtirish",
    appNotConfigured: "Ilova havolasi hali sozlanmagan - administrator bilan bog'laning.",
    balanceInfo: "Balansingiz, hamyoningiz va tangalaringizni ko'rish uchun ilovani oching:",
    chooseLanguage: "Tilni tanlang / Choose language / Выберите язык:",
    languageChanged: "Til o'zbekchaga o'zgartirildi \u2705",
    helpTitle: "\uD83D\uDCD6 Mavjud buyruqlar:",
    helpBody:
      "/start — Xush kelibsiz xabari va ilovani ochish\n" +
      "/app — Ilovani to'g'ridan-to'g'ri ochish\n" +
      "/profile — Telegram profilingiz haqida ma'lumot\n" +
      "/help — Ushbu xabar\n\n" +
      "Chiqindi topshirish, hamyoningizni tekshirish va o'yin o'ynash kabi asosiy amallar botda emas, ilovaning ichida amalga oshiriladi.",
    profileTitle: "\uD83D\uDC64 Sizning Telegram profilingiz",
    profileName: "Ism: ",
    profileUsername: "Username: ",
    profileLanguage: "Til: ",
    profileId: "Telegram ID: ",
    profileNote:
      "Hamyon balansi, tangalar va chiqindi tarixi ilova ichida (/app) ko'rsatiladi - bot hali bu ma'lumotlarga ega emas.",
    notSet: "yo'q",
    errorGeneric: "Nimadir xato ketdi. Birozdan so'ng qayta urinib ko'ring.",
    adminAskPassword: "\uD83D\uDD10 Admin panelga kirish uchun parolni kiriting:",
    adminWrongPassword: "\u274C Parol noto'g'ri. Qaytadan urinib ko'ring yoki /admin buyrug'ini qayta yuboring.",
    adminGranted: "\u2705 Kirish tasdiqlandi. Admin panelni ochish uchun tugmani bosing:",
    adminOpenPanel: "\uD83D\uDEE0\uFE0F Admin panelni ochish",
    adminNotConfigured: "Ilova havolasi hali sozlanmagan - administrator bilan bog'laning."
  },
  ru: {
    shortDescription: "EcoSort — бот для заработка на сдаче отходов на переработку.",
    description:
      "\u267B\uFE0F EcoSort — это бот, с помощью которого вы можете зарабатывать деньги, сдавая отходы (бумагу, пластик, металл, электронные отходы и т.д.) на переработку.\n\n" +
      "Сдайте отходы, дождитесь проверки и получите вознаграждение в своём кошельке. Также вы можете зарабатывать дополнительные монеты в игре.\n\n" +
      "Чтобы начать, нажмите кнопку Start внизу.",
    welcomeWithName: function (name) { return "Привет, " + name + "! \u267B\uFE0F Добро пожаловать в EcoSort."; },
    welcomeNoName: "Привет! \u267B\uFE0F Добро пожаловать в EcoSort.",
    startBody:
      "Сдавайте отходы (бумагу, пластик, металл, электронные отходы), получайте вознаграждение и зарабатывайте монеты в игре.\n\n" +
      "Быстрые команды:\n" +
      "/app — Открыть приложение\n" +
      "/profile — Ваш профиль Telegram\n" +
      "/help — Помощь\n\n" +
      "Вы можете использовать кнопки ниже:",
    openApp: "\uD83D\uDE80 Открыть приложение",
    balance: "\uD83D\uDCB0 Баланс",
    changeLanguage: "\uD83C\uDF10 Сменить язык",
    appNotConfigured: "Ссылка на приложение ещё не настроена - обратитесь к администратору.",
    balanceInfo: "Чтобы посмотреть баланс, кошелёк и монеты, откройте приложение:",
    chooseLanguage: "Выберите язык / Tilni tanlang / Choose language:",
    languageChanged: "Язык изменён на русский \u2705",
    helpTitle: "\uD83D\uDCD6 Доступные команды:",
    helpBody:
      "/start — Приветственное сообщение и открытие приложения\n" +
      "/app — Открыть приложение напрямую\n" +
      "/profile — Информация о вашем профиле Telegram\n" +
      "/help — Это сообщение\n\n" +
      "Основные действия - сдача отходов, проверка кошелька, игра - происходят внутри приложения, а не через команды бота.",
    profileTitle: "\uD83D\uDC64 Ваш профиль Telegram",
    profileName: "Имя: ",
    profileUsername: "Username: ",
    profileLanguage: "Язык: ",
    profileId: "Telegram ID: ",
    profileNote:
      "Баланс кошелька, монеты и история сдачи отходов отображаются внутри приложения (/app) - у бота пока нет доступа к этим данным.",
    notSet: "нет",
    errorGeneric: "Что-то пошло не так. Попробуйте ещё раз через некоторое время.",
    adminAskPassword: "\uD83D\uDD10 Введите пароль для доступа к админ-панели:",
    adminWrongPassword: "\u274C Неверный пароль. Попробуйте снова или отправьте /admin ещё раз.",
    adminGranted: "\u2705 Доступ подтверждён. Нажмите кнопку, чтобы открыть админ-панель:",
    adminOpenPanel: "\uD83D\uDEE0\uFE0F Открыть админ-панель",
    adminNotConfigured: "Ссылка на приложение ещё не настроена - обратитесь к администратору."
  },
  en: {
    shortDescription: "EcoSort - a bot where you can earn money by recycling your waste.",
    description:
      "\u267B\uFE0F EcoSort is a bot where you can earn money by submitting recyclable waste (paper, plastic, metal, e-waste, and more).\n\n" +
      "Submit your waste, wait for it to be reviewed, and see your reward in your wallet. You can also earn extra coins by playing the in-app game.\n\n" +
      "Tap the Start button below to begin.",
    welcomeWithName: function (name) { return "Hi " + name + "! \u267B\uFE0F Welcome to EcoSort."; },
    welcomeNoName: "Hi! \u267B\uFE0F Welcome to EcoSort.",
    startBody:
      "Submit your waste (paper, plastic, metal, e-waste), earn rewards, and collect coins by playing the game.\n\n" +
      "Quick commands:\n" +
      "/app - Open the app\n" +
      "/profile - Your Telegram profile\n" +
      "/help - Help\n\n" +
      "You can also use the buttons below:",
    openApp: "\uD83D\uDE80 Open App",
    balance: "\uD83D\uDCB0 Balance",
    changeLanguage: "\uD83C\uDF10 Change language",
    appNotConfigured: "The app link is not configured yet - please contact the administrator.",
    balanceInfo: "To see your balance, wallet, and coins, open the app:",
    chooseLanguage: "Choose language / Tilni tanlang / Выберите язык:",
    languageChanged: "Language changed to English \u2705",
    helpTitle: "\uD83D\uDCD6 Available commands:",
    helpBody:
      "/start - Welcome message and open the app\n" +
      "/app - Open the app directly\n" +
      "/profile - Info about your Telegram profile\n" +
      "/help - This message\n\n" +
      "Main actions - submitting waste, checking your wallet, playing the game - happen inside the app, not through bot commands.",
    profileTitle: "\uD83D\uDC64 Your Telegram profile",
    profileName: "Name: ",
    profileUsername: "Username: ",
    profileLanguage: "Language: ",
    profileId: "Telegram ID: ",
    profileNote:
      "Wallet balance, coins, and recycling history are shown inside the app (/app) - the bot does not have access to that data yet.",
    notSet: "N/A",
    errorGeneric: "Something went wrong. Please try again in a moment.",
    adminAskPassword: "\uD83D\uDD10 Enter the admin panel password:",
    adminWrongPassword: "\u274C Wrong password. Try again or send /admin once more.",
    adminGranted: "\u2705 Access granted. Tap the button to open the admin panel:",
    adminOpenPanel: "\uD83D\uDEE0\uFE0F Open Admin Panel",
    adminNotConfigured: "The app link is not configured yet - please contact the administrator."
  }
};

var SUPPORTED_LANGS = ['uz', 'ru', 'en'];
var DEFAULT_LANG = 'uz';

function normalizeLang(code) {
  if (!code) return DEFAULT_LANG;
  var short = String(code).slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.indexOf(short) !== -1 ? short : DEFAULT_LANG;
}

function t(lang) {
  return STRINGS[normalizeLang(lang)] || STRINGS[DEFAULT_LANG];
}

module.exports = {
  SUPPORTED_LANGS: SUPPORTED_LANGS,
  DEFAULT_LANG: DEFAULT_LANG,
  normalizeLang: normalizeLang,
  t: t
};
