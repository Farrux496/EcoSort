import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  ShieldAlert,
  Sparkles,
  Wifi,
  Battery,
  Signal,
} from 'lucide-react';
import { Language, User, WasteCategoryId } from './types';
import { StorageService, INITIAL_USER, INITIAL_ADMIN } from './services/storage';
import { getTranslation } from './services/translations';
import {
  isTelegramEnv,
  initTelegram,
  getTelegramWebApp,
  mapTelegramLanguage,
  buildUserFromTelegram,
  isAdminLaunch,
} from './services/telegram';
import { Header } from './components/common/Header';
import { BottomNav, TabId } from './components/common/BottomNav';
import { WelcomeView } from './components/views/WelcomeView';
import { AuthModal } from './components/views/AuthModals';
import { DashboardView } from './components/views/DashboardView';
import { ScannerView } from './components/views/ScannerView';
import { CategoriesView } from './components/views/CategoriesView';
import { WalletView } from './components/views/WalletView';
import { MissionsView } from './components/views/MissionsView';
import { GameView } from './components/views/GameView';
import { StatisticsView } from './components/views/StatisticsView';
import { LocationsView } from './components/views/LocationsView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { CourierScheduleView } from './components/views/CourierScheduleView';
import { RankingView } from './components/views/RankingView';
import { HistoryView } from './components/views/HistoryView';
import { NotificationsModal } from './components/views/NotificationsModal';
import { AdminView } from './components/views/AdminView';

// Detected once at module load - this doesn't change during the life of
// the page, so it doesn't need to be state.
const inTelegram = isTelegramEnv();

export default function App() {
  // Initialize storage, then - when opened inside Telegram - initialize
  // the WebApp SDK (expand, theme colors, etc.) and persist the
  // Telegram-derived identity so it survives a reload.
  useEffect(() => {
    StorageService.init();
    if (inTelegram) {
      const tg = initTelegram();
      const tgUser = tg?.initDataUnsafe.user;
      if (tgUser) {
        const merged = buildUserFromTelegram(tgUser, StorageService.getCurrentUser(), isAdminLaunch());
        StorageService.setCurrentUser(merged);
        setCurrentUser(merged);
        setLang(mapTelegramLanguage(tgUser.language_code));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [lang, setLang] = useState<Language>(() => StorageService.getLanguage());
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());

  // Views & navigation state
  // If user is null, start with 'welcome', else start on 'home' (dashboard).
  // Inside Telegram there's no login screen at all - identity comes from
  // Telegram, so we always land straight on 'home' (the init effect above
  // fills in the real user a moment later).
  const [activeScreen, setActiveScreen] = useState<
    | 'welcome'
    | 'home'
    | 'scan'
    | 'categories'
    | 'game-missions'
    | 'game-play'
    | 'wallet'
    | 'stats'
    | 'locations'
    | 'profile'
    | 'settings'
    | 'courier'
    | 'ranking'
    | 'history'
    | 'admin'
  >(() => (inTelegram || StorageService.getCurrentUser() ? 'home' : 'welcome'));

  const [bottomNavTab, setBottomNavTab] = useState<TabId>('home');
  const [preselectedCategory, setPreselectedCategory] = useState<WasteCategoryId>('plastic');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Desktop simulator mode toggle: 'phone-frame' (exact mobile replica) vs 'responsive-wide'.
  // Inside Telegram the WebApp is already rendered full-screen by the
  // Telegram client itself, so the phone mockup / judge toolbar below
  // (built for showing the app on a browser) is skipped entirely.
  const [deviceMode, setDeviceMode] = useState<'phone-frame' | 'responsive'>(() => {
    if (inTelegram) return 'responsive';
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 'responsive';
    }
    return 'phone-frame';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    StorageService.setLanguage(newLang);
  };

  const handleUserUpdate = (updated: User) => {
    setCurrentUser(updated);
    StorageService.setCurrentUser(updated);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveScreen('admin');
    } else {
      setActiveScreen('home');
      setBottomNavTab('home');
    }
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveScreen('welcome');
  };

  const handleBottomNavClick = (tab: TabId) => {
    setBottomNavTab(tab);
    if (tab === 'home') setActiveScreen('home');
    else if (tab === 'scan') setActiveScreen('scan');
    else if (tab === 'game') setActiveScreen('game-missions');
    else if (tab === 'history') setActiveScreen('history');
    else if (tab === 'profile') setActiveScreen('profile');
  };

  // Unread notifications count
  const unreadCount = StorageService.getNotifications().filter((n) => !n.read).length;

  // Active view content
  const renderCurrentView = () => {
    if (!currentUser || activeScreen === 'welcome') {
      return (
        <WelcomeView
          lang={lang}
          onLangChange={handleLanguageChange}
          onLoginClick={() => {
            setAuthModalType('login');
            setAuthModalOpen(true);
          }}
          onRegisterClick={() => {
            setAuthModalType('register');
            setAuthModalOpen(true);
          }}
          onQuickDemoUser={() => {
            handleLoginSuccess(INITIAL_USER);
          }}
          onQuickDemoAdmin={() => {
            handleLoginSuccess(INITIAL_ADMIN);
          }}
        />
      );
    }

    if (activeScreen === 'admin') {
      return (
        <AdminView
          adminUser={currentUser}
          lang={lang}
          onBack={() => {
            setActiveScreen('home');
            setBottomNavTab('home');
          }}
        />
      );
    }

    switch (activeScreen) {
      case 'home':
        return (
          <div className="min-h-screen bg-[#F8FAFC]">
            {/* Screen 2 Top Bar: EcoSort logo + Notifications bell */}
            <Header
              showLogo
              showNotifications
              unreadCount={unreadCount}
              onNotificationsClick={() => setNotificationsOpen(true)}
              currentLang={lang}
              onLangChange={handleLanguageChange}
              rightAction={
                currentUser.role === 'admin' ? (
                  <button
                    onClick={() => setActiveScreen('admin')}
                    className="p-2 bg-slate-900 text-emerald-400 rounded-full text-xs font-bold"
                    title="Admin Panel"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                ) : null
              }
            />
            <DashboardView
              user={currentUser}
              lang={lang}
              onNavigate={(dest) => {
                if (dest === 'scan') {
                  setActiveScreen('scan');
                  setBottomNavTab('scan');
                } else if (dest === 'wallet') setActiveScreen('wallet');
                else if (dest === 'game') {
                  setActiveScreen('game-missions');
                  setBottomNavTab('game');
                } else if (dest === 'stats') setActiveScreen('stats');
                else if (dest === 'courier') setActiveScreen('courier');
                else if (dest === 'locations') setActiveScreen('locations');
                else if (dest === 'categories') setActiveScreen('categories');
              }}
            />
          </div>
        );

      case 'scan':
        return (
          <ScannerView
            user={currentUser}
            lang={lang}
            preselectedCategoryId={preselectedCategory}
            onBack={() => {
              setActiveScreen('home');
              setBottomNavTab('home');
            }}
            onSuccessSubmit={() => {
              setActiveScreen('history');
              setBottomNavTab('history');
            }}
          />
        );

      case 'categories':
        return (
          <CategoriesView
            lang={lang}
            onBack={() => setActiveScreen('home')}
            onSelectCategory={(catId) => {
              setPreselectedCategory(catId);
              setActiveScreen('scan');
            }}
          />
        );

      case 'wallet':
        return (
          <WalletView
            user={currentUser}
            lang={lang}
            onBack={() => setActiveScreen('home')}
            onNavigateHistory={() => {
              setActiveScreen('history');
              setBottomNavTab('history');
            }}
            onNavigateRanking={() => setActiveScreen('ranking')}
            onUserUpdate={handleUserUpdate}
          />
        );

      case 'game-missions':
        return (
          <MissionsView
            user={currentUser}
            lang={lang}
            onBack={() => {
              setActiveScreen('home');
              setBottomNavTab('home');
            }}
            onStartGame={() => setActiveScreen('game-play')}
            onUserUpdate={handleUserUpdate}
          />
        );

      case 'game-play':
        return (
          <GameView
            user={currentUser}
            lang={lang}
            onBack={() => setActiveScreen('game-missions')}
            onUserUpdate={handleUserUpdate}
          />
        );

      case 'stats':
        return (
          <StatisticsView
            user={currentUser}
            lang={lang}
            onBack={() => setActiveScreen('home')}
          />
        );

      case 'locations':
        return (
          <LocationsView
            lang={lang}
            onBack={() => setActiveScreen('home')}
          />
        );

      case 'profile':
        return (
          <ProfileView
            user={currentUser}
            lang={lang}
            onBack={() => {
              setActiveScreen('home');
              setBottomNavTab('home');
            }}
            onOpenSettings={() => setActiveScreen('settings')}
            onUserUpdate={handleUserUpdate}
          />
        );

      case 'settings':
        return (
          <SettingsView
            user={currentUser}
            lang={lang}
            onBack={() => setActiveScreen('profile')}
            onLangChange={handleLanguageChange}
            onLogout={handleLogout}
            onOpenNotifications={() => setNotificationsOpen(true)}
          />
        );

      case 'courier':
        return (
          <CourierScheduleView
            user={currentUser}
            lang={lang}
            onBack={() => setActiveScreen('home')}
            onNewScan={() => {
              setActiveScreen('scan');
              setBottomNavTab('scan');
            }}
          />
        );

      case 'ranking':
        return (
          <RankingView
            user={currentUser}
            lang={lang}
            onBack={() => setActiveScreen('wallet')}
          />
        );

      case 'history':
        return (
          <HistoryView
            user={currentUser}
            lang={lang}
            onBack={() => {
              setActiveScreen('home');
              setBottomNavTab('home');
            }}
          />
        );

      default:
        return null;
    }
  };

  // Wire Telegram's native BackButton to the same "go home" action every
  // screen's own back arrow already uses, so the hardware/UI back control
  // Telegram shows in its chrome behaves the way users expect.
  useEffect(() => {
    if (!inTelegram) return;
    const tg = getTelegramWebApp();
    const backButton = tg?.BackButton;
    if (!backButton) return;

    const goHome = () => {
      setActiveScreen('home');
      setBottomNavTab('home');
    };

    if (activeScreen === 'home' || activeScreen === 'welcome') {
      backButton.hide();
    } else {
      backButton.show();
    }
    backButton.onClick(goHome);
    return () => backButton.offClick(goHome);
  }, [activeScreen]);

  // Determine if bottom nav should be shown
  const showBottomNav =
    currentUser &&
    activeScreen !== 'welcome' &&
    activeScreen !== 'game-play' &&
    activeScreen !== 'admin';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Device Switcher / Toolbar - only useful for browser/desktop
          demoing; Telegram already renders the app full-screen. */}
      {!inTelegram && (
      <aside aria-label="Device view switcher" className="w-full max-w-5xl py-2 px-4 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 bg-slate-950/60 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">EcoSort Qaraqalpaqstan</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-emerald-400/90 font-medium">
            Tábiyattı birge qorǵaymız
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin link button if logged in */}
          {currentUser && (
            <button
              onClick={() => setActiveScreen(activeScreen === 'admin' ? 'home' : 'admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeScreen === 'admin'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Admin {activeScreen === 'admin' ? '✕' : 'Panel'}
            </button>
          )}

          {/* Quick Language switch buttons in desktop top bar */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {(['kaa', 'uz', 'ru'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-colors ${
                  lang === l
                    ? 'bg-[#0D7C66] text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Phone Frame vs Full */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode('phone-frame')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                deviceMode === 'phone-frame'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Device Mockup matching reference"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Mockup</span>
            </button>

            <button
              onClick={() => setDeviceMode('responsive')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                deviceMode === 'responsive'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Wide view"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>
          </div>
        </div>
      </aside>
      )}

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4">
        {deviceMode === 'phone-frame' ? (
          /* Exact Phone Frame Container matching reference design */
          <div className="relative w-full max-w-[412px] h-[100dvh] sm:h-[880px] bg-white sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.45)] sm:border-[8px] sm:border-slate-800 overflow-hidden flex flex-col">
            {/* Phone Status Bar (9:41, Notch, Wifi, Battery) */}
            <div className="h-10 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between text-xs font-bold text-slate-800 shrink-0 z-40 select-none">
              <span className="tracking-tight text-[13px]">9:41</span>

              {/* Dynamic Island / Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />

              <div className="flex items-center gap-1.5 text-slate-800">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col justify-between">
              <div className="flex-1">{renderCurrentView()}</div>

              {/* Bottom Nav if active */}
              {showBottomNav && (
                <BottomNav
                  currentTab={bottomNavTab}
                  onTabChange={handleBottomNavClick}
                  lang={lang}
                />
              )}
            </div>

            {/* Mobile Home Bar indicator at bottom */}
            <div className="h-4 bg-white/95 flex items-center justify-center shrink-0 z-30 pointer-events-none">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        ) : (
          /* Responsive Wide View */
          <div className="w-full max-w-md bg-white min-h-[100dvh] shadow-2xl overflow-hidden flex flex-col justify-between">
            <div className="flex-1">{renderCurrentView()}</div>

            {showBottomNav && (
              <BottomNav
                currentTab={bottomNavTab}
                onTabChange={handleBottomNavClick}
                lang={lang}
              />
            )}
          </div>
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        type={authModalType}
        onSwitchType={(t) => setAuthModalType(t)}
        onSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        lang={lang}
      />
    </div>
  );
}
