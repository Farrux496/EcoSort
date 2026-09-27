import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Building, Eye, EyeOff } from 'lucide-react';
import { EcoSortLogo } from '../common/EcoSortLogo';
import { Language, User as UserType } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService, ASSETS } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'register';
  onSwitchType: (newType: 'login' | 'register') => void;
  onSuccess: (user: UserType) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  type,
  onSwitchType,
  onSuccess,
  lang,
}) => {
  if (!isOpen) return null;

  // Login form state
  const [loginEmail, setLoginEmail] = useState('demo@ecosort.local');
  const [loginPassword, setLoginPassword] = useState('ecosort123');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('+998 9');
  const [regEmail, setRegEmail] = useState('');
  const [regRegion, setRegRegion] = useState('Qaraqalpaqstan Respublikası');
  const [regDistrict, setRegDistrict] = useState('Nókis qalası');
  const [regStreet, setRegStreet] = useState('M. Ájiniyaz kóshesi');
  const [regHouseNumber, setRegHouseNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = StorageService.getUsers();
    const cleanEmail = loginEmail.trim().toLowerCase();

    // Check credentials
    if (cleanEmail === 'admin@ecosort.local' && loginPassword === 'admin123') {
      const admin = users.find((u) => u.email === cleanEmail) || users[1];
      StorageService.setCurrentUser(admin);
      onSuccess(admin);
      onClose();
      return;
    }

    if (
      (cleanEmail === 'demo@ecosort.local' || cleanEmail === 'farrux') &&
      loginPassword === 'ecosort123'
    ) {
      const user = users.find((u) => u.email === 'demo@ecosort.local') || users[0];
      StorageService.setCurrentUser(user);
      onSuccess(user);
      onClose();
      return;
    }

    // Check custom registered users
    const matched = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.phone === loginEmail.trim()
    );

    if (matched) {
      StorageService.setCurrentUser(matched);
      onSuccess(matched);
      onClose();
    } else {
      setError(
        lang === 'kaa'
          ? 'Pochta yamasa parol nadurıs! Demo: demo@ecosort.local / ecosort123'
          : lang === 'uz'
          ? 'Pochta yoki parol noto‘g‘ri! Demo: demo@ecosort.local / ecosort123'
          : 'Неверный логин или пароль! Демо: demo@ecosort.local / ecosort123'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !regPhone.trim() || !regPassword) {
      setError(
        lang === 'kaa'
          ? 'Barlıq májbúriy maydanlardı toltırıń!'
          : lang === 'uz'
          ? 'Barcha majburiy maydonlarni to‘ldiring!'
          : 'Пожалуйста, заполните все обязательные поля!'
      );
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newUser: UserType = {
      id: `#ES${randomNum}`,
      email: regEmail.trim() || `user${randomNum}@ecosort.uz`,
      fullName: fullName.trim(),
      phone: regPhone.trim(),
      region: regRegion.trim(),
      district: regDistrict.trim(),
      street: regStreet.trim(),
      houseNumber: regHouseNumber.trim() || '1',
      avatar: ASSETS.avatar,
      balance: 100, // Welcome gift of 100 EcoCoin
      totalRecycledKg: 0,
      totalSubmissionsCount: 0,
      xp: 0,
      maxXp: 200,
      level: 1,
      levelTitle: 'Baslawshı',
      role: 'user',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    StorageService.setCurrentUser(newUser);
    onSuccess(newUser);
    onClose();
  };

  const fillQuick = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setLoginEmail('admin@ecosort.local');
      setLoginPassword('admin123');
    } else {
      setLoginEmail('demo@ecosort.local');
      setLoginPassword('ecosort123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EcoSortLogo variant="horizontal" size="sm" />
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {type === 'login'
                ? getTranslation(lang, 'loginTitle')
                : getTranslation(lang, 'registerTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {type === 'login'
                ? getTranslation(lang, 'loginSubtitle')
                : getTranslation(lang, 'registerSubtitle')}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {type === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Quick autofill buttons */}
              <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs">
                <span className="text-emerald-800 font-semibold">Tezkor demo:</span>
                <button
                  type="button"
                  onClick={() => fillQuick('user')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100/50 text-emerald-800 font-medium rounded-lg border border-emerald-200 text-[11px] shadow-2xs"
                >
                  Farrux (User)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuick('admin')}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg text-[11px] shadow-2xs"
                >
                  Admin
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {getTranslation(lang, 'email')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="demo@ecosort.local"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {getTranslation(lang, 'password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold rounded-xl shadow-md shadow-emerald-900/10 active:scale-[0.98] transition-all text-sm mt-2"
              >
                {getTranslation(lang, 'login')}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  {getTranslation(lang, 'dontHaveAccount')}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    onSwitchType('register');
                  }}
                  className="text-xs font-bold text-[#0D7C66] hover:underline"
                >
                  {getTranslation(lang, 'register')}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {getTranslation(lang, 'fullName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Farrux Mardonov"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {getTranslation(lang, 'phone')} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {getTranslation(lang, 'district')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      placeholder="Nókis qalası"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {getTranslation(lang, 'street')}
                  </label>
                  <input
                    type="text"
                    value={regStreet}
                    onChange={(e) => setRegStreet(e.target.value)}
                    placeholder="M. Ájiniyaz kóshesi"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {getTranslation(lang, 'houseNumber')}
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      value={regHouseNumber}
                      onChange={(e) => setRegHouseNumber(e.target.value)}
                      placeholder="12"
                      className="w-full pl-7 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {getTranslation(lang, 'password')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold rounded-xl shadow-md shadow-emerald-900/10 active:scale-[0.98] transition-all text-sm mt-3"
              >
                {getTranslation(lang, 'register')}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">
                  {getTranslation(lang, 'alreadyHaveAccount')}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    onSwitchType('login');
                  }}
                  className="text-xs font-bold text-[#0D7C66] hover:underline"
                >
                  {getTranslation(lang, 'login')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
