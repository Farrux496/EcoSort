import React, { useState } from 'react';
import { ArrowLeft, Bell, Globe, Settings } from 'lucide-react';
import { EcoSortLogo } from './EcoSortLogo';
import { Language } from '../../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLogo?: boolean;
  showNotifications?: boolean;
  unreadCount?: number;
  onNotificationsClick?: () => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  currentLang?: Language;
  onLangChange?: (lang: Language) => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showLogo = false,
  showNotifications = false,
  unreadCount = 0,
  onNotificationsClick,
  showSettings = false,
  onSettingsClick,
  currentLang = 'kaa',
  onLangChange,
  rightAction,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langLabels: Record<Language, { label: string; flag: string }> = {
    kaa: { label: 'Qaraqalpaqsha', flag: '🇺🇿' },
    uz: { label: 'O‘zbekcha', flag: '🇺🇿' },
    ru: { label: 'Русский', flag: '🇷🇺' },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between min-h-[58px]">
      <div className="flex items-center gap-3">
        {showBack && onBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
        ) : null}

        {showLogo ? (
          <EcoSortLogo variant="horizontal" size="md" />
        ) : title ? (
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {/* Language selector dropdown */}
        {onLangChange && (
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 rounded-full border border-slate-200 transition-colors"
              title="Change language"
            >
              <span>{langLabels[currentLang].flag}</span>
              <span className="hidden sm:inline">{langLabels[currentLang].label}</span>
              <span className="text-[10px] opacity-70">▼</span>
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Til / Язык
                  </div>
                  {(['kaa', 'uz', 'ru'] as Language[]).map((lng) => (
                    <button
                      key={lng}
                      onClick={() => {
                        onLangChange(lng);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                        currentLang === lng
                          ? 'font-bold text-emerald-800 bg-emerald-50/70'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="text-base">{langLabels[lng].flag}</span>
                      <span>{langLabels[lng].label}</span>
                      {currentLang === lng && (
                        <span className="ml-auto text-emerald-600 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Notifications Icon with blue badge matching Screen 2 */}
        {showNotifications && (
          <button
            onClick={onNotificationsClick}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        )}

        {/* Settings gear icon matching Screen 6 */}
        {showSettings && (
          <button
            onClick={onSettingsClick}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        {rightAction}
      </div>
    </header>
  );
};
