import React from 'react';
import { Camera, Coins, Gamepad2, BarChart3, Leaf, Recycle, ChevronRight } from 'lucide-react';
import { Language, User } from '../../types';
import { getTranslation } from '../../services/translations';
import { ASSETS } from '../../services/storage';

interface DashboardViewProps {
  user: User;
  lang: Language;
  onNavigate: (tab: 'scan' | 'game' | 'history' | 'profile' | 'wallet' | 'stats' | 'courier' | 'locations' | 'categories') => void;
  todayStats?: {
    scanned: number;
    recycledKg: number;
    bonusCoins: number;
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  lang,
  onNavigate,
  todayStats = { scanned: 12, recycledKg: 5.8, bonusCoins: 1200 },
}) => {
  return (
    <div className="pb-24 pt-2 px-4 space-y-4 max-w-md mx-auto">
      {/* Top Banner Card matching Screen 2 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBFBF3] via-[#E6F8EE] to-[#DDF5E6] border border-emerald-200/70 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex-1 pr-1">
            <h2 className="text-base font-extrabold text-[#064E3B] leading-tight tracking-tight">
              {getTranslation(lang, 'homeBannerTitle')}
            </h2>
            <p className="text-xs text-emerald-800/90 font-medium mt-1.5 leading-snug">
              {getTranslation(lang, 'homeBannerSubtitle')}
            </p>
          </div>

          {/* Banner landscape illustration */}
          <div className="w-24 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-emerald-300/60 relative">
            <img
              src={ASSETS.landscape}
              alt="Qaraqalpaqstan"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Decorative subtle grass blades in corner */}
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-emerald-300/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 4 Quick Action Cards (2x2 Grid) matching Screen 2 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Qaldıqtı skanlaw */}
        <button
          onClick={() => onNavigate('scan')}
          className="bg-white hover:bg-slate-50/80 active:scale-[0.98] transition-all p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100/70 transition-colors">
            <Camera className="w-6 h-6 text-[#0D9488] stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 leading-snug block">
              {getTranslation(lang, 'quickScan')}
            </span>
          </div>
        </button>

        {/* 2. Meniń Bonusım */}
        <button
          onClick={() => onNavigate('wallet')}
          className="bg-white hover:bg-slate-50/80 active:scale-[0.98] transition-all p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100/70 transition-colors">
            <Coins className="w-6 h-6 text-amber-500 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 leading-snug block">
              {getTranslation(lang, 'quickWallet')}
            </span>
          </div>
        </button>

        {/* 3. Oyın (topshiriqlar) */}
        <button
          onClick={() => onNavigate('game')}
          className="bg-white hover:bg-slate-50/80 active:scale-[0.98] transition-all p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100/70 transition-colors">
            <Gamepad2 className="w-6 h-6 text-blue-500 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 leading-snug block">
              {getTranslation(lang, 'quickGame')}
            </span>
          </div>
        </button>

        {/* 4. Statistika */}
        <button
          onClick={() => onNavigate('stats')}
          className="bg-white hover:bg-slate-50/80 active:scale-[0.98] transition-all p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0 group-hover:bg-cyan-100/70 transition-colors">
            <BarChart3 className="w-6 h-6 text-cyan-600 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 leading-snug block">
              {getTranslation(lang, 'quickStats')}
            </span>
          </div>
        </button>
      </div>

      {/* "Bugungi kórsetkishler" section with 3 white cards matching Screen 2 */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider px-1">
          {getTranslation(lang, 'todayIndicators')}
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: 12 Skan qılındı */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-base font-extrabold text-slate-800 leading-tight">
              {todayStats.scanned}
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">
              {getTranslation(lang, 'scannedCount')}
            </span>
          </div>

          {/* Card 2: 5.8 kg Qayta islendi */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
              <Recycle className="w-4 h-4 text-[#0D7C66]" />
            </div>
            <span className="text-base font-extrabold text-slate-800 leading-tight">
              {todayStats.recycledKg} kg
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">
              {getTranslation(lang, 'recycledKg')}
            </span>
          </div>

          {/* Card 3: 1 200 Bonus toplandı */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center mb-1">
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-base font-extrabold text-slate-800 leading-tight">
              {todayStats.bonusCoins.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">
              {getTranslation(lang, 'bonusEarned')}
            </span>
          </div>
        </div>
      </div>

      {/* Extra handy quick tiles: Kuryer jadvali & Qaldıq tapsırıw nuktaları */}
      <div className="pt-2 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('courier')}
          className="p-3 bg-gradient-to-br from-white to-slate-50/70 border border-slate-200/80 rounded-2xl text-left flex items-center justify-between hover:border-emerald-300 transition-colors shadow-2xs"
        >
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              {getTranslation(lang, 'courierSchedule')}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              Toza Hudud xızmeti
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigate('locations')}
          className="p-3 bg-gradient-to-br from-white to-slate-50/70 border border-slate-200/80 rounded-2xl text-left flex items-center justify-between hover:border-emerald-300 transition-colors shadow-2xs"
        >
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              {getTranslation(lang, 'locationsTitle')}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              Nókis kartası
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Categories quick link */}
      <div className="pt-1">
        <button
          onClick={() => onNavigate('categories')}
          className="w-full py-2.5 px-4 bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-200/70 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800 transition-colors"
        >
          <span>{getTranslation(lang, 'selectCategoryTitle')} (6 túr)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
