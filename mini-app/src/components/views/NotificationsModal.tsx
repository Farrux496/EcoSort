import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Truck, Award, Coins, ArrowUpRight } from 'lucide-react';
import { Language, NotificationItem } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService } from '../../services/storage';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const notifications = StorageService.getNotifications();

  // Mark all as read when opened
  StorageService.markNotificationsAsRead();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'waste_approved':
      case 'coin_received':
        return <Coins className="w-4 h-4 text-emerald-600" />;
      case 'mission_completed':
      case 'level_up':
      case 'certificate_unlocked':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'courier_scheduled':
      case 'courier_status':
        return <Truck className="w-4 h-4 text-teal-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0D7C66]" />
            <h3 className="text-base font-bold text-slate-800">
              {getTranslation(lang, 'notifications')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Xabarnomalar joq
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-start gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
