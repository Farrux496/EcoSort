import React, { useState } from 'react';
import { Star, Gamepad2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Header } from '../common/Header';
import { Language, Mission, User } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService, ASSETS } from '../../services/storage';

interface MissionsViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
  onStartGame: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  user,
  lang,
  onBack,
  onStartGame,
  onUserUpdate,
}) => {
  const [filterTab, setFilterTab] = useState<'daily' | 'weekly'>('daily');
  const [missions, setMissions] = useState<Mission[]>(StorageService.getMissions());

  const filteredMissions = missions.filter((m) => m.type === filterTab);

  const handleClaim = (missionId: string) => {
    const updated = missions.map((m) => {
      if (m.id === missionId && m.completed && !m.claimed) {
        // Fire celebratory confetti!
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }

        // Award EcoCoins to user
        const newBalance = user.balance + m.reward;
        const newXp = user.xp + Math.round(m.reward / 2);
        let newLevel = user.level;
        let newMaxXp = user.maxXp;
        let newLevelTitle = user.levelTitle;

        if (newXp >= user.maxXp) {
          newLevel += 1;
          newMaxXp = Math.round(user.maxXp * 1.5);
          if (newLevel === 4) newLevelTitle = 'EcoQaharman';
          else if (newLevel >= 5) newLevelTitle = 'EcoMaster';

          // Level up notification
          StorageService.addNotification({
            id: `notif-${Date.now()}-lvl`,
            userId: user.id,
            title: 'Dáreje ósti!',
            message: `Qutlıqlaymız! Siz ${newLevel}-dárejege (${newLevelTitle}) jettińiz!`,
            type: 'level_up',
            date: new Date().toLocaleDateString(),
            read: false,
          });
        }

        const updatedUser: User = {
          ...user,
          balance: newBalance,
          xp: newXp,
          level: newLevel,
          maxXp: newMaxXp,
          levelTitle: newLevelTitle,
        };
        StorageService.setCurrentUser(updatedUser);
        onUserUpdate(updatedUser);

        // Record transaction
        StorageService.addTransaction({
          id: `tx-m-${Date.now()}`,
          userId: user.id,
          title: `Topshırıq: ${getTranslation(lang, m.titleKey as any)}`,
          amount: m.reward,
          type: 'credit',
          date: new Date().toLocaleDateString(),
          status: 'completed',
        });

        return { ...m, claimed: true };
      }
      return m;
    });

    setMissions(updated);
    StorageService.updateMissions(updated);
  };

  const xpPercentage = Math.min(100, Math.round((user.xp / user.maxXp) * 100));

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'missionsTitle')}
        showBack
        onBack={onBack}
      />

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Hero Mascot Banner matching Screen 5 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DDF5E6] via-[#E6F8EE] to-[#E2F7EB] border border-emerald-200/80 p-4 shadow-sm flex items-center justify-between">
          <div className="flex-1 pr-2">
            <h2 className="text-base font-extrabold text-[#064E3B] leading-tight">
              {getTranslation(lang, 'heroBannerTitle')}
            </h2>
            <p className="text-xs text-emerald-800/90 font-medium mt-1 leading-snug">
              {getTranslation(lang, 'heroBannerSubtitle')}
            </p>

            <button
              onClick={onStartGame}
              className="mt-3 px-3.5 py-1.5 bg-[#0D7C66] hover:bg-[#095848] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>{getTranslation(lang, 'gameTitle')}</span>
            </button>
          </div>

          {/* Anime Mascot Character matching Screen 5 */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-emerald-300/60 bg-emerald-100/40 relative">
            <img
              src={ASSETS.mascot}
              alt="EcoQaharman mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Level / XP Progress Card matching Screen 5 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center text-white shadow-sm shrink-0">
            <Star className="w-7 h-7 fill-white stroke-amber-500 stroke-[1.5]" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {user.level}-dáreje · {user.levelTitle}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {user.xp} / {user.maxXp} XP
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-[#0D7C66] rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs: [Kúnlik topshiriqlar] | [Aptalıq] matching Screen 5 */}
        <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl">
          <button
            onClick={() => setFilterTab('daily')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              filterTab === 'daily'
                ? 'bg-[#0D7C66] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {getTranslation(lang, 'dailyMissions')}
          </button>

          <button
            onClick={() => setFilterTab('weekly')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              filterTab === 'weekly'
                ? 'bg-[#0D7C66] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {getTranslation(lang, 'weeklyMissions')}
          </button>
        </div>

        {/* Missions List matching Screen 5 */}
        <div className="space-y-2.5">
          {filteredMissions.map((m) => {
            const isReadyToClaim = m.completed && !m.claimed;

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#0D7C66]" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">
                      {getTranslation(lang, m.titleKey as any)}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-extrabold text-amber-600 flex items-center gap-1">
                        🪙 +{m.reward}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {m.current}/{m.target} {m.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status / Claim button matching Screen 5 */}
                <div>
                  {m.claimed ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : isReadyToClaim ? (
                    <button
                      onClick={() => handleClaim(m.id)}
                      className="px-3 py-1.5 bg-[#0D7C66] hover:bg-[#095848] text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all"
                    >
                      {getTranslation(lang, 'claimReward')}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      {m.current}/{m.target}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
