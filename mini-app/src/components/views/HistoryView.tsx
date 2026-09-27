import React, { useState } from 'react';
import { Clock, Calendar, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from '../common/Header';
import { Language, Submission, User } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService } from '../../services/storage';

interface HistoryViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ user, lang, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const submissions = StorageService.getSubmissions().filter(
    (s) => s.userId === user.id || s.userId === '#ES10234'
  );

  const filtered = submissions.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'history')}
        showBack
        onBack={onBack}
      />

      <div className="p-4 max-w-md mx-auto space-y-3">
        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'all'
                ? 'bg-[#0D7C66] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Bárliǵi ({submissions.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'approved'
                ? 'bg-[#0D7C66] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Tastıyıqlanǵan
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'pending'
                ? 'bg-[#0D7C66] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Tekseriwde
          </button>
        </div>

        {/* Submissions list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400">
              Tariyx bos
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.categoryName}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {item.categoryName}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.weightKg} kg · {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-800 block">
                      +{item.coinsEarned} EcoCoin
                    </span>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        item.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'approved'
                        ? 'Tastıyıqlanǵan'
                        : item.status === 'pending'
                        ? 'Kútilmekte'
                        : 'Bas tartılǵan'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-teal-600" />
                    <span>
                      {item.courierType === 'tezkor' ? 'Tezkor kuryer' : 'Haftalik kuryer'}
                    </span>
                  </div>
                  <span>{item.courierStatus}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
