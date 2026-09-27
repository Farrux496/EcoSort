// Telegram WebApp SDK integration.
//
// The script tag for this SDK is loaded in index.html:
//   <script src="https://telegram.org/js/telegram-web-app.js"></script>
// It attaches window.Telegram.WebApp when the page is opened by Telegram
// (as a bot's Mini App). Outside Telegram (a normal browser), the script
// still loads but initData stays empty - that's how we tell the two apart
// and fall back to the existing demo/login flow for browser testing,
// exactly like the previous static web-mini-app did (see its js/telegram.js).

import { Language, User } from '../types';
import { INITIAL_USER } from './storage';

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
  };
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  disableVerticalSwipes?: () => void;
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

// initData is only populated when the page was actually opened through a
// bot's Web App button - Telegram Desktop/Web sometimes injects the SDK
// object on ordinary pages too, so we check initData rather than just the
// object's presence.
export function isTelegramEnv(): boolean {
  const tg = getTelegramWebApp();
  return !!(tg && tg.initData);
}

export function initTelegram(): TelegramWebApp | null {
  const tg = getTelegramWebApp();
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.('#0D7C66');
    tg.setBackgroundColor?.('#F8FAFC');
    tg.disableVerticalSwipes?.();
  } catch {
    // Older Telegram clients may not implement every method above - the
    // Mini App should still work without them.
  }
  return tg;
}

export function mapTelegramLanguage(code?: string): Language {
  if (code === 'ru') return 'ru';
  if (code === 'uz') return 'uz';
  return 'kaa';
}

// Builds (or refreshes) the app's User record from the Telegram identity,
// replacing the email/password login flow - matching the legacy
// web-mini-app's "Telegram-based identity, no login/register" approach.
// If a Telegram-linked user already exists in storage, their EcoCoins/
// history are preserved and only their name/avatar are refreshed;
// otherwise a fresh profile is seeded from INITIAL_USER's demo stats
// (there's still no shared backend in this MVP - see project README).
type TelegramUser = NonNullable<TelegramWebApp['initDataUnsafe']['user']>;

export function buildUserFromTelegram(
  tgUser: TelegramUser,
  existing: User | null,
  isAdmin: boolean
): User {
  const tgId = `#TG${tgUser.id}`;
  const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || tgUser.username || 'EcoSort user';

  const base: User =
    existing && existing.id === tgId
      ? existing
      : { ...INITIAL_USER, id: tgId, email: `${tgId}@telegram.local` };

  return {
    ...base,
    fullName,
    avatar: tgUser.photo_url || base.avatar,
    role: isAdmin ? 'admin' : base.role,
  };
}

// Reads the ?admin=1 query param the bot appends after the /admin
// password gate (see tg-bot/handlers/textHandler.js) to grant the admin
// role for this session. Demo-only, not secure - same caveat as before.
export function isAdminLaunch(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('admin') === '1';
}
