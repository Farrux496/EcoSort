import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Phone,
  Coins,
  Recycle,
  Edit3,
  Award,
  ChevronRight,
  CheckCircle2,
  X,
  User as UserIcon,
} from 'lucide-react';
import { Header } from '../common/Header';
import { CertificateModal } from './CertificateModal';
import { Certificate, Language, User } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService, ASSETS } from '../../services/storage';

interface ProfileViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
  onOpenSettings: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  lang,
  onBack,
  onOpenSettings,
  onUserUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Edit form state
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [region, setRegion] = useState(user.region);
  const [district, setDistrict] = useState(user.district);
  const [street, setStreet] = useState(user.street);
  const [houseNumber, setHouseNumber] = useState(user.houseNumber);

  const certificates = StorageService.getCertificates();
  // Sync count from user
  const updatedCertificates = certificates.map((cert) => {
    const isUnlocked = user.totalSubmissionsCount >= cert.countRequired;
    return {
      ...cert,
      currentCount: user.totalSubmissionsCount,
      unlocked: isUnlocked,
    };
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      fullName: fullName.trim(),
      phone: phone.trim(),
      region: region.trim(),
      district: district.trim(),
      street: street.trim(),
      houseNumber: houseNumber.trim(),
    };
    StorageService.setCurrentUser(updated);
    onUserUpdate(updated);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'myProfile')}
        showBack
        onBack={onBack}
        showSettings
        onSettingsClick={onOpenSettings}
      />

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Profile Card Header matching Screen 6 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          {/* Avatar with circle styling matching Screen 6 */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-50 border-2 border-emerald-500/80 p-0.5 shrink-0 shadow-xs">
            <img
              src={user.avatar || ASSETS.avatar}
              alt={user.fullName}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-800">
                {user.fullName}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                title="Edit profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              ID: {user.id}
            </p>

            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {user.level}-dáreje · {user.levelTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed User Information List matching Screen 6 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm divide-y divide-slate-100">
          {/* Row 1: Aumaq */}
          <div className="py-3 flex items-center justify-between first:pt-1 last:pb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {getTranslation(lang, 'areaNukus')}
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-800">
              {user.region || 'Nókis qalası'}
            </span>
          </div>

          {/* Row 2: Úy nomeri */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <Building className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {getTranslation(lang, 'houseLabel')}
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-800">
              {user.houseNumber || '12'}
            </span>
          </div>

          {/* Row 3: Telefon */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <Phone className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {getTranslation(lang, 'phoneLabel')}
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-800 font-mono">
              {user.phone || '+998 90 123 45 67'}
            </span>
          </div>

          {/* Row 4: Toplangan bonus */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {getTranslation(lang, 'totalEarnedBonus')}
              </span>
            </div>
            <span className="text-xs font-extrabold text-emerald-800">
              {user.balance.toLocaleString()} EcoCoin
            </span>
          </div>

          {/* Row 5: Qayta ishlangan chiqindi */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {getTranslation(lang, 'recycledWasteTotal')}
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-800">
              {user.totalRecycledKg} kg
            </span>
          </div>
        </div>

        {/* Certificates & Achievements section */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {getTranslation(lang, 'certificatesTab')}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {user.totalSubmissionsCount} qaldıq tapsırıldı
            </span>
          </div>

          <div className="space-y-2.5">
            {updatedCertificates.map((cert) => {
              const progress = Math.min(100, Math.round((cert.currentCount / cert.countRequired) * 100));

              return (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {getTranslation(lang, cert.titleKey as any)}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {cert.currentCount} / {cert.countRequired}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="px-2.5 py-1 text-xs font-bold text-[#0D7C66] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      {getTranslation(lang, 'viewCertificate')}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-[#0D7C66] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {getTranslation(lang, 'editProfile')}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 pt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {getTranslation(lang, 'fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {getTranslation(lang, 'phone')}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {getTranslation(lang, 'areaNukus')}
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {getTranslation(lang, 'houseLabel')}
                  </label>
                  <input
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {getTranslation(lang, 'street')}
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0D7C66] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#095848]"
                >
                  {getTranslation(lang, 'saveProfile')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                >
                  {getTranslation(lang, 'cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          user={user}
          lang={lang}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};
