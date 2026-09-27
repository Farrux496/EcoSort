/**
 * CHIQINDI PROJECT — i18n (Phase 5)
 *
 * Responsibilities:
 *  - Load locales/{lang}.json (uz / ru / en)
 *  - Determine the active language in this order:
 *      1) a language the user manually chose before (localStorage)
 *      2) the Telegram user's language_code (via window.Chiqindi.telegram,
 *         set by js/telegram.js — this script must load AFTER telegram.js)
 *      3) fallback: "uz"
 *  - Apply translations to:
 *      - every element with [data-i18n="some.key"] -> its textContent
 *      - a small set of elements matched by CSS class, for text that isn't
 *        wrapped in a dedicated tag (footer description/copyright/hours),
 *        matched safely by exact original English text so unrelated
 *        elements sharing the same class are never touched by mistake
 *  - Expose window.Chiqindi.i18n.setLanguage(lang) and render a visible
 *    UZ/RU/EN language switcher into any element with id="langSwitcher"
 *    found on the page
 *
 * Never throws: if a locale fails to load (e.g. opened via file:// where
 * fetch() of local JSON is blocked by the browser), the page simply keeps
 * whatever text is already in the HTML (English) instead of crashing.
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['uz', 'ru', 'en'];
  var DEFAULT_LANG = 'uz';
  var STORAGE_KEY = 'chiqindi_lang';

  // Elements whose translatable text is a full sentence/paragraph rather
  // than a single label, matched by class + exact original English text
  // so we never accidentally overwrite unrelated content in that class.
  var TEXT_MATCH_TARGETS = [
    { selector: '.footer-description', originalText: 'We are committed to providing innovative and sustainable solutions for electronic waste management, helping create a cleaner future for our planet.', key: 'footer.description' },
    { selector: '.copyright', originalText: '© 2025 EcoSort. All Rights Reserved.', key: 'footer.copyright' },
    { selector: '.contact-text', originalText: 'Mon - Fri: 9:00 AM - 6:00 PM', key: 'footer.hours' }
  ];

  function getByPath(obj, path) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return null;
      cur = cur[parts[i]];
    }
    return (typeof cur === 'string') ? cur : null;
  }

  function normalizeLang(code) {
    if (!code) return DEFAULT_LANG;
    var short = String(code).slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.indexOf(short) !== -1 ? short : DEFAULT_LANG;
  }

  function detectLanguage() {
    try {
      var stored = window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
        return stored;
      }
    } catch (err) {
      // localStorage unavailable (e.g. privacy mode) — continue silently.
    }

    try {
      var tgState = window.Chiqindi && window.Chiqindi.telegram;
      if (tgState && tgState.languageCode) {
        return normalizeLang(tgState.languageCode);
      }
    } catch (err) {
      // ignore, fall through to default
    }

    return DEFAULT_LANG;
  }

  function persistLanguage(lang) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch (err) {
      // non-fatal
    }
  }

  function applyDataI18n(dict) {
    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function (node) {
      var key = node.getAttribute('data-i18n');
      var value = getByPath(dict, key);
      if (value) {
        node.textContent = value;
      }
    });
  }

  function applyDataI18nPlaceholder(dict) {
    var nodes = document.querySelectorAll('[data-i18n-placeholder]');
    nodes.forEach(function (node) {
      var key = node.getAttribute('data-i18n-placeholder');
      var value = getByPath(dict, key);
      if (value) {
        node.setAttribute('placeholder', value);
      }
    });
  }

  function applyTextMatchTargets(dict) {
    TEXT_MATCH_TARGETS.forEach(function (target) {
      var value = getByPath(dict, target.key);
      if (!value) return;
      var nodes = document.querySelectorAll(target.selector);
      nodes.forEach(function (node) {
        var current = (node.textContent || '').replace(/\s+/g, ' ').trim();
        var original = target.originalText.replace(/\s+/g, ' ').trim();
        if (current === original) {
          node.textContent = value;
        } else if (current === value) {
          // already translated (e.g. re-applying same language) — leave as is
        }
      });
    });
  }

  function renderLanguageSwitcher(currentLang) {
    var container = document.getElementById('langSwitcher');
    if (!container) return;

    var LABELS = { uz: 'UZ', ru: 'RU', en: 'EN' };
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.gap = '6px';
    container.style.alignItems = 'center';

    SUPPORTED_LANGS.forEach(function (lang) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = LABELS[lang] || lang.toUpperCase();
      btn.setAttribute('data-lang', lang);
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '13px';
      btn.style.fontWeight = '600';
      btn.style.padding = '6px 10px';
      btn.style.borderRadius = '20px';
      btn.style.border = '1px solid var(--primary-green, #2ecc71)';
      if (lang === currentLang) {
        btn.style.background = 'var(--primary-green, #2ecc71)';
        btn.style.color = '#fff';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = 'var(--primary-green, #2ecc71)';
      }
      btn.addEventListener('click', function () {
        setLanguage(lang);
      });
      container.appendChild(btn);
    });
  }

  function loadLocale(lang, callback) {
    fetch('locales/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('locale fetch failed: ' + res.status);
        return res.json();
      })
      .then(function (dict) {
        callback(dict);
      })
      .catch(function (err) {
        console.warn('[Chiqindi/i18n] could not load locale "' + lang + '":', err);
        // Non-fatal: leave existing (English) markup text as-is.
      });
  }

  function setLanguage(lang) {
    lang = normalizeLang(lang);
    persistLanguage(lang);
    loadLocale(lang, function (dict) {
      applyDataI18n(dict);
      applyDataI18nPlaceholder(dict);
      applyTextMatchTargets(dict);
      renderLanguageSwitcher(lang);
      document.documentElement.setAttribute('lang', lang);
      try {
        document.dispatchEvent(new CustomEvent('chiqindi:language-changed', { detail: { lang: lang, dict: dict } }));
      } catch (err) {
        // non-fatal
      }
    });
  }

  function init() {
    window.Chiqindi = window.Chiqindi || {};
    window.Chiqindi.i18n = {
      setLanguage: setLanguage,
      getSupportedLanguages: function () { return SUPPORTED_LANGS.slice(); },
      getCurrentLanguage: function () {
        try {
          return (window.localStorage && window.localStorage.getItem(STORAGE_KEY)) || DEFAULT_LANG;
        } catch (err) {
          return DEFAULT_LANG;
        }
      }
    };

    setLanguage(detectLanguage());
  }

  function start() {
    // If telegram.js already ran (script order guarantees this), detection
    // can happen immediately; otherwise wait for its ready event so the
    // Telegram-detected language is available on first paint.
    if (window.Chiqindi && window.Chiqindi.telegram) {
      init();
    } else {
      document.addEventListener('chiqindi:telegram-ready', init, { once: true });
      // Safety net: if telegram.js never fires the event for any reason,
      // still initialize i18n with the default/stored language.
      setTimeout(function () {
        if (!(window.Chiqindi && window.Chiqindi.i18n)) {
          init();
        }
      }, 1500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
