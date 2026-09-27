import React from 'react';
import { Home, Scan, Gamepad2, Clock, User as UserIcon } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../services/translations';

export type TabId = 'home' | 'scan' | 'game' | 'history' | 'profile';

interface BottomNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, lang }) => {
  const tabs = [
    {
      id: 'home' as TabId,
      label: getTranslation(lang, 'navHome'),
      icon: Home,
    },
    {
      id: 'scan' as TabId,
      label: getTranslation(lang, 'navScan'),
      icon: Scan,
    },
    {
      id: 'game' as TabId,
      label: getTranslation(lang, 'navGame'),
      icon: Gamepad2,
    },
    {
      id: 'history' as TabId,
      label: getTranslation(lang, 'navHistory'),
      icon: Clock,
    },
    {
      id: 'profile' as TabId,
      label: getTranslation(lang, 'navProfile'),
      icon: UserIcon,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] px-3 py-1.5 flex items-center justify-around safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all select-none min-w-[56px] ${
              isActive
                ? 'text-[#0D7C66] font-bold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'stroke-[2.4] text-[#0D7C66]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight whitespace-nowrap">
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 bg-[#0D7C66] rounded-full mt-0.5 -mb-1 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
