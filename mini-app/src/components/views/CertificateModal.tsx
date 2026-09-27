import React from 'react';
import { X, Printer, Award, Download, CheckCircle2 } from 'lucide-react';
import { EcoSortLogo } from '../common/EcoSortLogo';
import { KarakalpakPattern } from '../common/KarakalpakPattern';
import { Certificate, Language, User } from '../../types';
import { getTranslation } from '../../services/translations';

interface CertificateModalProps {
  certificate: Certificate;
  user: User;
  lang: Language;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  user,
  lang,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Top actions */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800">
              {getTranslation(lang, certificate.titleKey as any)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#0D7C66] text-white hover:bg-[#095848] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, 'printCertificate')}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Document */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex items-center justify-center print:p-0 print:bg-white">
          <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl shadow-md border-8 border-teal-800 p-6 flex flex-col items-center text-center overflow-hidden">
            {/* Karakalpak Frame Ornaments */}
            <KarakalpakPattern variant="certificate-frame" />

            {/* Official Logo at top matching lock requirement */}
            <div className="mt-2 mb-2">
              <EcoSortLogo variant="official-bubbly" size="sm" />
            </div>

            {/* Certificate Header */}
            <h2 className="text-xl font-black text-teal-900 tracking-wider uppercase mt-1">
              SERTIFIKAT
            </h2>
            <div className="w-20 h-0.5 bg-amber-500 my-1.5" />

            <h3 className="text-sm font-extrabold text-[#0D7C66]">
              {getTranslation(lang, certificate.titleKey as any)}
            </h3>

            {/* Recipient */}
            <div className="my-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold block">
                {getTranslation(lang, 'awardedTo')}
              </span>
              <p className="text-lg font-serif font-black text-slate-900 border-b-2 border-slate-300 pb-1 px-4 mt-0.5 inline-block">
                {user.fullName}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 font-serif leading-relaxed px-4 my-2">
              {getTranslation(lang, 'certificateDescription')}
            </p>

            {/* Gold Seal & Verification metadata */}
            <div className="w-full flex items-center justify-between border-t border-slate-200/90 pt-3 mt-4 text-[10px] text-slate-500">
              <div className="text-left">
                <span className="block font-bold text-slate-700">
                  {getTranslation(lang, 'certificateCode')}:
                </span>
                <span className="font-mono text-slate-500">
                  {certificate.certificateCode}
                </span>
              </div>

              {/* Gold Seal */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-500 flex flex-col items-center justify-center text-amber-950 font-bold shadow-xs">
                <span className="text-[9px]">EcoSort</span>
                <span className="text-[8px] opacity-80">RASMIY</span>
              </div>

              <div className="text-right">
                <span className="block font-bold text-slate-700">
                  {getTranslation(lang, 'dateLabel')}:
                </span>
                <span>{certificate.issueDate || '26.09.2026'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
