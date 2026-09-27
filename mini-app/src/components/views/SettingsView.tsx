import React, { useState } from 'react';
import {
  Globe,
  Bell,
  HelpCircle,
  Info,
  Shield,
  LogOut,
  ChevronRight,
  Check,
  X,
  PhoneCall,
} from 'lucide-react';
import { Header } from '../common/Header';
import { KarakalpakPattern } from '../common/KarakalpakPattern';
import { EcoSortLogo } from '../common/EcoSortLogo';
import { Language, User } from '../../types';
import { getTranslation } from '../../services/translations';

interface SettingsViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
  onLangChange: (newLang: Language) => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  lang,
  onBack,
  onLangChange,
  onLogout,
  onOpenNotifications,
}) => {
  const [showLangModal, setShowLangModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const langNames: Record<Language, { label: string; flag: string }> = {
    kaa: { label: 'Qaraqalpaqsha', flag: '🇺🇿' },
    uz: { label: 'O‘zbekcha', flag: '🇺🇿' },
    ru: { label: 'Русский', flag: '🇷🇺' },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 flex flex-col justify-between">
      <div>
        <Header
          title={getTranslation(lang, 'settingsTitle')}
          showBack
          onBack={onBack}
        />

        <div className="p-4 max-w-md mx-auto space-y-3">
          {/* Settings Menu Cards matching Screen 10 */}
          <div className="bg-white rounded-3xl p-2 border border-slate-100 shadow-sm divide-y divide-slate-100">
            {/* 1. Tildi órnatıw */}
            <button
              onClick={() => setShowLangModal(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-2xl group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {getTranslation(lang, 'setLanguage')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <span>{langNames[lang].label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 2. Xabarnomalar */}
            <button
              onClick={onOpenNotifications}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-2xl group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {getTranslation(lang, 'notifications')}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3. Járdem hám qollap-quwatlaw */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-2xl group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {getTranslation(lang, 'helpSupport')}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 4. Biz turalı */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-2xl group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0D7C66]">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {getTranslation(lang, 'aboutUs')}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 5. Maxfiylik siyasatı */}
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-2xl group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {getTranslation(lang, 'privacyPolicy')}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 6. Shıǵıw (Logout in Red) matching Screen 10 */}
            <button
              onClick={onLogout}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-50/50 transition-colors rounded-2xl group text-red-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">
                  {getTranslation(lang, 'logout')}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Karakalpak Bottom Ribbon Border matching Screen 10 */}
      <div className="w-full mt-6">
        <KarakalpakPattern variant="bottom-ribbon" className="text-teal-600" />
      </div>

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                {getTranslation(lang, 'setLanguage')}
              </h3>
              <button
                onClick={() => setShowLangModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {(['kaa', 'uz', 'ru'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => {
                    onLangChange(lng);
                    setShowLangModal(false);
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    lang === lng
                      ? 'bg-emerald-50 text-[#0D7C66] border border-emerald-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{langNames[lng].flag}</span>
                    <span>{langNames[lng].label}</span>
                  </div>
                  {lang === lng && <Check className="w-4 h-4 text-[#0D7C66]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {getTranslation(lang, 'helpSupport')}
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Qaldıqlardı saralaw, kuryer shaqırıw yamasa EcoCoin-ler boyınsha sorawlarıńız bolsa biz benen baylanısıń:
            </p>

            <div className="p-3 bg-emerald-50 rounded-2xl text-xs space-y-1.5 font-medium text-emerald-900">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>+998 61 222 33 44</span>
              </div>
              <div>Pochta: info@ecosort.uz</div>
              <div>Telegram: @EcoSortKarakalpakstan</div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-100 space-y-3 text-center">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center -mt-2">
              <EcoSortLogo variant="official-bubbly" size="sm" />
            </div>

            <h3 className="text-sm font-extrabold text-slate-800">
              EcoSort — Tábiyattı birge qorǵaymız
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed text-left">
              {getTranslation(lang, 'aboutAppText')}
            </p>

            <p className="text-[11px] text-slate-400">
              Versiya 1.0.0 (PWA) · Nókis, Qaraqalpaqstan
            </p>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {getTranslation(lang, 'privacyPolicy')}
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 max-h-60 overflow-y-auto leading-relaxed">
              <p>
                EcoSort paydalanıwshılardıń jeke maǵlıwmatların qorǵawǵa kepillik beredi.
              </p>
              <p>
                Barlıq kuryer mánzilleri hám telefon nomerleri tek ǵana Toza Hudud qaldıq jıynaw xızmetin orınlaw ushın qollanıladı.
              </p>
              <p>
                Maǵlıwmatlar lokal túrde saqlanadı hám úshinshi shaxslarǵa berilmeydi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
