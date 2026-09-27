import React from 'react';
import { Header } from '../common/Header';
import { Language, WasteCategory, WasteCategoryId } from '../../types';
import { getTranslation } from '../../services/translations';
import { WASTE_CATEGORIES } from '../../services/storage';

interface CategoriesViewProps {
  lang: Language;
  onBack: () => void;
  onSelectCategory: (categoryId: WasteCategoryId) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  lang,
  onBack,
  onSelectCategory,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'selectCategoryTitle')}
        showBack
        onBack={onBack}
      />

      <div className="p-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3.5">
          {WASTE_CATEGORIES.map((cat: WasteCategory) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white hover:bg-emerald-50/40 active:scale-[0.98] transition-all rounded-3xl p-3.5 border border-slate-100 shadow-sm flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Image Frame matching Screen 7 */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center mb-2.5 p-1 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={cat.image}
                  alt={cat.nameKey}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title */}
              <span className="text-xs font-bold text-slate-800 leading-snug">
                {getTranslation(lang, cat.nameKey as any)}
              </span>

              {/* Rate badge & description */}
              <div className="mt-1.5 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +{cat.ratePerKg} EcoCoin/kg
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
