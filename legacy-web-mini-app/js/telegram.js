/**
 * CHIQINDI PROJECT — Telegram WebApp integration
 *
 * Responsibilities (Phase 4 only):
 *  - Initialize the Telegram WebApp SDK when running inside Telegram
 *      (tg.ready(), tg.expand())
 *  - Safely fall back to a Demo User when opened in a normal browser
 *      (window.Telegram.WebApp not present) — must never throw/crash
 *  - Expose a single global state object (window.Chiqindi.telegram) that
 *      later phases (i18n, profile, wallet, admin) can read from
 *  - Fire a "chiqindi:telegram-ready" DOM event so other scripts can react
 *      once detection has finished, without tight coupling
 *
 * IMPORTANT SECURITY NOTE (per project spec):
 *  tg.initDataUnsafe is for UI/demo display only. It is NOT cryptographically
 *  verified and must never be treated as proof of identity for anything that
 *  grants rewards, money, or admin access. Real verification of Telegram
 *  initData must happen server-side (Netlify Function) in a later phase.
 */
(function () {
  'use strict';

  var DEMO_USER = {
    firstName: 'Demo',
    lastName: 'User',
    username: 'demo_user',
    languageCode: 'uz',
    id: null
  };

  function safeCall(fn) {
    try {
      fn();
    } catch (err) {
      // Telegram unavailable/misbehaving must never break the page.
      console.warn('[Chiqindi/telegram] non-fatal init warning:', err);
    }
  }

  function detectTelegram() {
    var tg = null;
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
      }
    } catch (err) {
      tg = null;
    }
    return tg;
  }

  function buildUserFromTelegram(tg) {
    var raw = null;
    try {
      raw = tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : null;
    } catch (err) {
      raw = null;
    }

    if (!raw) {
      return null;
    }

    return {
      id: raw.id || null,
      firstName: raw.first_name || '',
      lastName: raw.last_name || '',
      username: raw.username || '',
      languageCode: raw.language_code || 'uz'
    };
  }

  function init() {
    var tg = detectTelegram();
    var isTelegramContext = !!tg;
    var user = null;

    if (isTelegramContext) {
      // Required Telegram Mini App bootstrap calls.
      safeCall(function () { tg.ready(); });
      safeCall(function () { tg.expand(); });

      user = buildUserFromTelegram(tg);

      // Even inside Telegram, initDataUnsafe.user can be briefly unavailable
      // (e.g. testing via desktop Telegram web without a real launch context).
      if (!user) {
        user = DEMO_USER;
      }
    } else {
      // Browser fallback — Mini App must remain fully testable outside Telegram.
      user = DEMO_USER;
    }

    window.Chiqindi = window.Chiqindi || {};
    window.Chiqindi.telegram = {
      tg: tg,
      isTelegramContext: isTelegramContext,
      user: user,
      languageCode: (user && user.languageCode) || 'uz'
    };

    safeCall(function () {
      document.dispatchEvent(new CustomEvent('chiqindi:telegram-ready', {
        detail: window.Chiqindi.telegram
      }));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
