import React, { useState } from 'react';
import { Leaf, Coins, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Header } from '../common/Header';
import { Language, User } from '../../types';
import { getTranslation } from '../../services/translations';

interface StatisticsViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  user,
  lang,
  onBack,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'thisMonth' | 'lastMonth' | 'allTime'>('thisMonth');

  // Waste category distribution matching Screen 9
  const categoryData = [
    { name: 'Plastik', key: 'plastic', weight: 28, color: '#0D9488' },
    { name: 'Qáǵaz', key: 'paper', weight: 12, color: '#0EA5E9' },
    { name: 'Shisha', key: 'glass', weight: 10, color: '#10B981' },
    { name: 'Metall', key: 'metal', weight: 6, color: '#F59E0B' },
    { name: 'Organik', key: 'organic', weight: 2, color: '#84CC16' },
  ];

  const monthlyGoal = 100;
  const currentMonthly = user.totalRecycledKg || 58;
  const progressPercent = Math.min(100, Math.round((currentMonthly / monthlyGoal) * 100));

  // Circular donut math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'statsTitle')}
        showBack
        onBack={onBack}
        rightAction={
          <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
            <span>{getTranslation(lang, 'thisMonth')}</span>
            <span className="text-[10px] opacity-70">▼</span>
          </div>
        }
      />

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Top 2 Metric Cards matching Screen 9 */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: 58 kg Qayta islendi */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-800 leading-none block">
                {currentMonthly} kg
              </span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                {getTranslation(lang, 'recycledMetric')}
              </span>
            </div>
          </div>

          {/* Card 2: 12 450 Bonus */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-800 leading-none block">
                {user.balance.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                {getTranslation(lang, 'bonusMetric')}
              </span>
            </div>
          </div>
        </div>

        {/* Qaldıqlar boyinsha (Bar Chart) matching Screen 9 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {getTranslation(lang, 'byWasteType')}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">kg hisobida</span>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} kg`, 'Salmaq']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="weight" radius={[8, 8, 0, 0]} maxBarSize={38}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend list */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            {categoryData.map((item) => (
              <div key={item.key} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.weight}kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aylıq progress (Circular progress) matching Screen 9 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {getTranslation(lang, 'monthlyProgress')}
            </h3>
            <p className="text-lg font-extrabold text-slate-800 mt-2">
              {currentMonthly} kg / {monthlyGoal} kg
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Maqsetke {monthlyGoal - currentMonthly} kg qaldı
            </p>
          </div>

          {/* Donut progress graphic */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-slate-100 stroke-current"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-[#0D7C66] stroke-current transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-base font-black text-slate-800">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Environmental impact note */}
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            🌱
          </div>
          <div className="text-xs">
            <span className="font-bold text-emerald-900 block">
              Siz 87 kg CO2 shıǵındısın tejedıńiz!
            </span>
            <span className="text-emerald-700 text-[11px]">
              Bul 4 terek egiwge teń nátiyje.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
