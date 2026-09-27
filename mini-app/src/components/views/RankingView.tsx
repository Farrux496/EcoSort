import React from 'react';
import { Trophy, Medal, Star, ArrowLeft } from 'lucide-react';
import { Header } from '../common/Header';
import { Language, User } from '../../types';
import { getTranslation } from '../../services/translations';
import { ASSETS } from '../../services/storage';

interface RankingViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
}

export const RankingView: React.FC<RankingViewProps> = ({ user, lang, onBack }) => {
  // Leaderboard data in Nukus / Karakalpakstan
  const leaderboard = [
    {
      rank: 1,
      name: 'Aynur Tilewmuratova',
      district: 'Nókis, Samanbay',
      recycledKg: 94.2,
      coins: 21300,
      levelTitle: 'EcoMaster',
      avatar: ASSETS.avatar,
    },
    {
      rank: 2,
      name: 'Azamat Qallibekov',
      district: 'Nókis, 23-mikrorayon',
      recycledKg: 76.5,
      coins: 16800,
      levelTitle: 'EcoQaharman',
      avatar: ASSETS.avatar,
    },
    {
      rank: 3,
      name: user.fullName || 'Farrux Mardonov',
      district: user.district || 'Nókis qalası',
      recycledKg: user.totalRecycledKg || 58.0,
      coins: user.balance || 12450,
      levelTitle: user.levelTitle || 'Jasıl dos',
      avatar: user.avatar || ASSETS.avatar,
      isCurrentUser: true,
    },
    {
      rank: 4,
      name: 'Gulnaz Joldasbaeva',
      district: 'Nókis, Qos-kól',
      recycledKg: 49.0,
      coins: 10200,
      levelTitle: 'Jasıl dos',
      avatar: ASSETS.avatar,
    },
    {
      rank: 5,
      name: 'Rustam Bazarbaev',
      district: 'Xojeli rayonı',
      recycledKg: 35.8,
      coins: 7800,
      levelTitle: 'Tábiyat dosı',
      avatar: ASSETS.avatar,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'ranking')}
        showBack
        onBack={onBack}
      />

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Top 3 podium banner */}
        <div className="bg-gradient-to-br from-[#0D7C66] to-[#043329] rounded-3xl p-5 text-white text-center relative overflow-hidden shadow-md">
          <Trophy className="w-8 h-8 text-amber-300 mx-auto mb-1 animate-bounce" />
          <h2 className="text-base font-extrabold">Qaraqalpaqstan Reytingi</h2>
          <p className="text-xs text-emerald-200 mt-0.5">
            Eń kóp qaldıq tapsırǵan tábiyat qorǵawshıları
          </p>
        </div>

        {/* Leaderboard list */}
        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm divide-y divide-slate-100">
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              className={`p-3 rounded-2xl flex items-center justify-between transition-colors ${
                item.isCurrentUser ? 'bg-emerald-50/80 border border-emerald-200 ring-1 ring-emerald-300' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 text-center font-black text-sm text-slate-500">
                  {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                </div>

                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold text-slate-800">
                      {item.name}
                    </h4>
                    {item.isCurrentUser && (
                      <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-bold">
                        Siz
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {item.district} · {item.levelTitle}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-[#0D7C66] block">
                  {item.recycledKg} kg
                </span>
                <span className="text-[10px] text-amber-600 font-bold">
                  🪙 {item.coins.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
