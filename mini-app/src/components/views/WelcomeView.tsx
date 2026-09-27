import React, { useState } from 'react';
import { EcoSortLogo } from '../common/EcoSortLogo';
import { KarakalpakPattern } from '../common/KarakalpakPattern';
import { Language } from '../../types';
import { getTranslation } from '../../services/translations';
import { ASSETS } from '../../services/storage';

interface WelcomeViewProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onQuickDemoUser: () => void;
  onQuickDemoAdmin: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  lang,
  onLangChange,
  onLoginClick,
  onRegisterClick,
  onQuickDemoUser,
  onQuickDemoAdmin,
}) => {
  const [langDropdown, setLangDropdown] = useState(false);

  const langNames: Record<Language, { name: string; flag: string }> = {
    kaa: { name: 'Qaraqalpaqsha', flag: '🇺🇿' },
    uz: { name: 'O‘zbekcha', flag: '🇺🇿' },
    ru: { name: 'Русский', flag: '🇷🇺' },
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col justify-between overflow-hidden">
      {/* Top Bar with Karakalpak Diamond and Language Pill */}
      <div className="px-5 pt-4 flex items-center justify-between z-20">
        {/* Top left Karakalpak ornament */}
        <div className="relative">
          <KarakalpakPattern variant="corner-diamond" className="w-14 h-14 text-teal-600" />
        </div>

        {/* Top right language selector pill matching Screen 1 */}
        <div className="relative">
          <button
            onClick={() => setLangDropdown(!langDropdown)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white shadow-sm border border-slate-200/90 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            <span>{langNames[lang].flag}</span>
            <span>{langNames[lang].name}</span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>

          {langDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setLangDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {(['kaa', 'uz', 'ru'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      onLangChange(l);
                      setLangDropdown(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                      lang === l ? 'font-bold text-emerald-800 bg-emerald-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{langNames[l].flag}</span>
                    <span>{langNames[l].name}</span>
                    {lang === l && <span className="ml-auto text-emerald-600">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Hero Section: EcoSort Logo & Karakalpakstan Landscape */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 z-10">
        {/* EcoSort logo with slogan */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-1">
            <EcoSortLogo variant="horizontal" size="xl" />
          </div>
          <p className="text-base font-semibold text-emerald-900 tracking-tight">
            {getTranslation(lang, 'slogan')}
          </p>
        </div>

        {/* Karakalpakstan Chilpyk Landscape illustration */}
        <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-md border-2 border-emerald-100/80 bg-white relative aspect-[4/3] group">
          <img
            src={ASSETS.landscape}
            alt="Qaraqalpaqstan Chilpyk fortress landscape"
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle warm gradient overlay at bottom of photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent pointer-events-none" />

          {/* Flying birds or subtle badge */}
          <div className="absolute top-3 right-4 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-medium text-emerald-900">
            Shılpıq · Nókis
          </div>
        </div>
      </div>

      {/* Bottom Actions: Kiriw & Tirkeliw */}
      <div className="px-6 pb-2 pt-2 flex flex-col gap-3 z-10 w-full max-w-md mx-auto">
        {/* Kiriw Button */}
        <button
          onClick={onLoginClick}
          className="w-full py-4 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center tracking-wide"
        >
          {getTranslation(lang, 'login')}
        </button>

        {/* Tirkeliw Button */}
        <button
          onClick={onRegisterClick}
          className="w-full py-4 bg-white hover:bg-emerald-50/50 text-[#0D7C66] border-2 border-[#0D7C66] font-bold text-base rounded-2xl shadow-xs active:scale-[0.98] transition-all flex items-center justify-center tracking-wide"
        >
          {getTranslation(lang, 'register')}
        </button>

        {/* Quick Demo Access Bar */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
          <button
            onClick={onQuickDemoUser}
            className="hover:text-emerald-700 underline font-medium"
          >
            {getTranslation(lang, 'demoLoginUser')}
          </button>
          <span>•</span>
          <button
            onClick={onQuickDemoAdmin}
            className="hover:text-emerald-700 underline font-medium"
          >
            {getTranslation(lang, 'demoLoginAdmin')}
          </button>
        </div>
      </div>

      {/* Decorative Karakalpak Bottom Ribbon Border */}
      <div className="w-full mt-2">
        <KarakalpakPattern variant="bottom-ribbon" className="text-teal-600" />
      </div>
    </div>
  );
};
