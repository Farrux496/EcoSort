import React, { useState } from 'react';
import { Truck, Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from '../common/Header';
import { Language, Submission, User } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService } from '../../services/storage';

interface CourierScheduleViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
  onNewScan: () => void;
}

export const CourierScheduleView: React.FC<CourierScheduleViewProps> = ({
  user,
  lang,
  onBack,
  onNewScan,
}) => {
  const submissions = StorageService.getSubmissions().filter(
    (s) => s.userId === user.id || s.userId === '#ES10234'
  );

  const statusBadge = (status: Submission['courierStatus']) => {
    switch (status) {
      case 'Kútilmekte':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Belgilenǵen':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Jolǵa shıqtı':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Alıp ketildi':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'courierSchedule')}
        showBack
        onBack={onBack}
      />

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Info card about the two courier types */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
              <span>⚡</span>
              <span>{getTranslation(lang, 'tezkorCourier')}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              30 kg-dan joqarı qaldıqlar ushın arнаўlı xızmet
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#0D7C66] font-bold text-xs">
              <span>📅</span>
              <span>{getTranslation(lang, 'haftalikCourier')}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Toza Hudud hár háptelik rejelestirilgen jıynawı
            </p>
          </div>
        </div>

        {/* List of Scheduled Pickups ("Menıń kuryerlerim") */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {getTranslation(lang, 'myCouriers')}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {submissions.length} keste
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center space-y-3">
              <Truck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">
                {getTranslation(lang, 'noUpcomingPickups')}
              </p>
              <button
                onClick={onNewScan}
                className="px-4 py-2 bg-[#0D7C66] text-white text-xs font-bold rounded-xl"
              >
                Qaldıq tapsırıw
              </button>
            </div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-[#0D7C66]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-slate-800">
                          {sub.courierType === 'tezkor' ? '⚡ TEZKOR KURYER' : '📅 HAFTALIK KURYER'}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {sub.weightKg} kg · {sub.categoryName}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusBadge(
                      sub.courierStatus
                    )}`}
                  >
                    {sub.courierStatus}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sub.courierDate}</span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sub.courierTime}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sub.address}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
