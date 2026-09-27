import React, { useState } from 'react';
import { Search, MapPin, Navigation, Clock, Phone, ChevronRight } from 'lucide-react';
import { Header } from '../common/Header';
import { Language, RecyclingLocation } from '../../types';
import { getTranslation } from '../../services/translations';
import { INITIAL_LOCATIONS } from '../../services/storage';

interface LocationsViewProps {
  lang: Language;
  onBack: () => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({ lang, onBack }) => {
  const [locations, setLocations] = useState<RecyclingLocation[]>(INITIAL_LOCATIONS);
  const [selectedLoc, setSelectedLoc] = useState<RecyclingLocation>(INITIAL_LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeActive, setRouteActive] = useState(false);

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 flex flex-col justify-between">
      <div>
        <Header
          title={getTranslation(lang, 'locationsTitle')}
          showBack
          onBack={onBack}
        />

        <div className="p-4 max-w-md mx-auto space-y-3">
          {/* Search bar matching Screen 8 */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation(lang, 'searchLocation')}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>

          {/* Interactive Map Canvas of Nukus matching Screen 8 */}
          <div className="relative w-full h-80 rounded-3xl overflow-hidden border border-slate-200 bg-[#E8F3EE] shadow-sm select-none">
            {/* SVG stylised city map texture with river, roads, and green zones */}
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 400 320"
              preserveAspectRatio="none"
            >
              {/* City background fill */}
              <rect width="400" height="320" fill="#EBF4EE" />

              {/* Green parks and reserves */}
              <rect x="20" y="20" width="80" height="70" rx="15" fill="#D3EAD9" opacity="0.8" />
              <rect x="280" y="40" width="90" height="110" rx="20" fill="#D3EAD9" opacity="0.8" />
              <rect x="180" y="220" width="120" height="80" rx="16" fill="#D3EAD9" opacity="0.8" />

              {/* Amu Darya Canal / Kyzketken water channel */}
              <path
                d="M -20 180 C 100 170 140 120 220 110 C 300 100 350 70 420 60"
                stroke="#BAE6FD"
                strokeWidth="18"
                fill="none"
              />

              {/* Major arterial roads (Nukus streets) */}
              <path d="M 0 80 L 400 80" stroke="#FFFFFF" strokeWidth="10" />
              <path d="M 0 160 L 400 160" stroke="#FFFFFF" strokeWidth="12" />
              <path d="M 0 240 L 400 240" stroke="#FFFFFF" strokeWidth="10" />
              <path d="M 120 0 L 120 320" stroke="#FFFFFF" strokeWidth="10" />
              <path d="M 240 0 L 240 320" stroke="#FFFFFF" strokeWidth="12" />
              <path d="M 330 0 L 330 320" stroke="#FFFFFF" strokeWidth="8" />

              {/* Diagonal Avenues */}
              <path d="M 30 0 L 370 320" stroke="#FFFFFF" strokeWidth="8" />

              {/* Active Route Polyline if route shown */}
              {routeActive && (
                <path
                  d={`M 120 160 Q 180 180 ${selectedLoc.coords.x * 4} ${selectedLoc.coords.y * 3.2}`}
                  stroke="#0D7C66"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  fill="none"
                />
              )}
            </svg>

            {/* Interactive Recycling Pin Markers with halos matching Screen 8 */}
            {locations.map((loc) => {
              const isSelected = selectedLoc.id === loc.id;

              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLoc(loc);
                    setRouteActive(false);
                  }}
                  style={{
                    left: `${loc.coords.x}%`,
                    top: `${loc.coords.y}%`,
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-transform duration-200 hover:scale-110 z-10"
                >
                  {/* Glowing pulsing aura */}
                  <div
                    className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                      isSelected ? 'bg-emerald-500 scale-150' : 'bg-teal-400'
                    }`}
                  />

                  {/* Pin Body matching Screen 8 */}
                  <div
                    className={`relative w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${
                      isSelected
                        ? 'bg-[#0D7C66] text-white border-white scale-110'
                        : 'bg-emerald-600 text-white border-emerald-100'
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                      <path d="m14 16-3 3 3 3" />
                      <path d="M8.294 4.5h7.412a1.83 1.83 0 0 1 1.57.882 1.785 1.785 0 0 1 .005 1.784l-2.08 3.604" />
                      <path d="m10 8 3-3-3-3" />
                    </svg>
                  </div>
                </button>
              );
            })}

            {/* Current user location dot */}
            <div className="absolute top-[50%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Location Card matching Screen 8 */}
      <div className="p-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-bold">
                ♻️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-800">
                    {selectedLoc.name}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedLoc.distance}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedLoc.address}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedLoc.hours}</span>
            </div>
            <a
              href={`tel:${selectedLoc.phone}`}
              className="text-[#0D7C66] font-bold hover:underline"
            >
              {selectedLoc.phone}
            </a>
          </div>

          {/* Show route button matching Screen 8 */}
          <button
            onClick={() => setRouteActive(true)}
            className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold text-xs rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>
              {routeActive
                ? `${selectedLoc.distance} masofa bo‘yicha yo‘l ko‘rsatilmoqda`
                : getTranslation(lang, 'showRoute')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
