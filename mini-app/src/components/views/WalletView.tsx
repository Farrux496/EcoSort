import React, { useState } from 'react';
import {
  CreditCard,
  Clock,
  Star,
  Tag,
  ArrowRight,
  Coins,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Header } from '../common/Header';
import { Language, Transaction, User, Withdrawal } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService, ASSETS } from '../../services/storage';

interface WalletViewProps {
  user: User;
  lang: Language;
  onBack: () => void;
  onNavigateHistory: () => void;
  onNavigateRanking: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  user,
  lang,
  onBack,
  onNavigateHistory,
  onNavigateRanking,
  onUserUpdate,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [promoError, setPromoError] = useState('');

  // Withdrawal form
  const [withdrawAmountUZS, setWithdrawAmountUZS] = useState('50000');
  const [cardNumber, setCardNumber] = useState('8600 ');
  const [cardHolder, setCardHolder] = useState(user.fullName || 'Farrux Mardonov');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const transactions = StorageService.getTransactions().filter(
    (tx) => tx.userId === user.id || tx.userId === '#ES10234'
  );

  const coinRate = 10; // 1 EcoCoin = 10 UZS
  const balanceUZS = user.balance * coinRate;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');

    const uzs = parseInt(withdrawAmountUZS, 10);
    if (isNaN(uzs) || uzs < 50000) {
      setWithdrawError(getTranslation(lang, 'withdrawMinNotice'));
      return;
    }

    const requiredCoins = Math.ceil(uzs / coinRate);
    if (user.balance < requiredCoins) {
      setWithdrawError(getTranslation(lang, 'insufficientBalance'));
      return;
    }

    const newWithdrawal: Withdrawal = {
      id: `w-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      amountUZS: uzs,
      ecoCoins: requiredCoins,
      cardNumber: cardNumber.trim(),
      cardHolder: cardHolder.trim(),
      status: 'pending',
      date: new Date().toLocaleDateString(),
    };

    StorageService.addWithdrawal(newWithdrawal);

    // Deduct EcoCoin balance
    const updatedUser: User = {
      ...user,
      balance: user.balance - requiredCoins,
    };
    StorageService.setCurrentUser(updatedUser);
    onUserUpdate(updatedUser);

    // Record transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      title: lang === 'kaa' ? 'Kartaga shıǵarıw' : lang === 'uz' ? 'Kartaga yechish' : 'Вывод на карту',
      amount: requiredCoins,
      type: 'debit',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString().slice(0, 5),
      status: 'pending',
    };
    StorageService.addTransaction(newTx);

    // Notification
    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: lang === 'kaa' ? 'Shıǵarıw sorawı jiberildi' : lang === 'uz' ? 'Yechib olish so‘rovi yuborildi' : 'Заявка на вывод отправлена',
      message: `${uzs.toLocaleString()} so'm (${requiredCoins} EcoCoin). Karta: ${cardNumber}`,
      type: 'withdrawal',
      date: new Date().toLocaleDateString(),
      read: false,
    });

    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 1800);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const code = promoCode.trim().toUpperCase();
    if (code === 'ECO2026' || code === 'QARAQALPAQSTAN' || code === 'TOZAHUDUD') {
      const bonus = 500;
      const updatedUser: User = {
        ...user,
        balance: user.balance + bonus,
      };
      StorageService.setCurrentUser(updatedUser);
      onUserUpdate(updatedUser);

      // Record transaction
      StorageService.addTransaction({
        id: `tx-promo-${Date.now()}`,
        userId: user.id,
        title: `Promokod: ${code}`,
        amount: bonus,
        type: 'credit',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString().slice(0, 5),
        status: 'completed',
      });

      setPromoSuccess(`+${bonus} EcoCoin qosıldı!`);
      setPromoCode('');
      setTimeout(() => {
        setShowPromoModal(false);
        setPromoSuccess('');
      }, 1500);
    } else {
      setPromoError(
        lang === 'kaa'
          ? 'Nadurıs promokod! Sınap kórıń: ECO2026'
          : lang === 'uz'
          ? 'Noto‘g‘ri promokod! Sinab ko‘ring: ECO2026'
          : 'Неверный промокод! Попробуйте: ECO2026'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header
        title={getTranslation(lang, 'myBonus')}
        showBack
        onBack={onBack}
      />

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Emerald Green Balance Card matching Screen 4 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D7C66] via-[#095848] to-[#043329] p-5 text-white shadow-lg shadow-emerald-950/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center backdrop-blur-xs">
                <Coins className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xs font-semibold text-emerald-100/90 tracking-tight">
                {getTranslation(lang, 'totalBalance')}
              </span>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Withdraw"
            >
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>
          </div>

          {/* Big number */}
          <div className="mt-1">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {user.balance.toLocaleString()}
            </h2>
            <p className="text-xs font-medium text-emerald-200/90 mt-1">
              EcoCoin ≈ {balanceUZS.toLocaleString()} som
            </p>
          </div>

          {/* Decorative shine background arcs */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-24 h-24 bg-emerald-300/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* 4 Action Cards Row matching Screen 4 */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* 1. Kartaga shıǵarıw */}
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-white hover:bg-slate-50 active:scale-95 transition-all p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-1.5 group-hover:bg-emerald-100 transition-colors">
              <CreditCard className="w-5 h-5 text-[#0D7C66]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-tight">
              {getTranslation(lang, 'withdrawToCard')}
            </span>
          </button>

          {/* 2. Tarix */}
          <button
            onClick={onNavigateHistory}
            className="bg-white hover:bg-slate-50 active:scale-95 transition-all p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-1.5 group-hover:bg-teal-100 transition-colors">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-tight">
              {getTranslation(lang, 'history')}
            </span>
          </button>

          {/* 3. Reyting */}
          <button
            onClick={onNavigateRanking}
            className="bg-white hover:bg-slate-50 active:scale-95 transition-all p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-1.5 group-hover:bg-amber-100 transition-colors">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-tight">
              {getTranslation(lang, 'ranking')}
            </span>
          </button>

          {/* 4. Promokod */}
          <button
            onClick={() => setShowPromoModal(true)}
            className="bg-white hover:bg-slate-50 active:scale-95 transition-all p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-1.5 group-hover:bg-blue-100 transition-colors">
              <Tag className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-tight">
              {getTranslation(lang, 'promocode')}
            </span>
          </button>
        </div>

        {/* Sońǵı operatsiyalar matching Screen 4 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {getTranslation(lang, 'recentTransactions')}
            </h3>
            <button
              onClick={onNavigateHistory}
              className="text-xs font-bold text-[#0D7C66] hover:underline"
            >
              {getTranslation(lang, 'viewAll')}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((tx) => {
              // Icon image based on category
              const imgUrl =
                tx.categoryId === 'plastic'
                  ? ASSETS.plastic
                  : tx.categoryId === 'paper'
                  ? ASSETS.paper
                  : tx.categoryId === 'glass'
                  ? ASSETS.glass
                  : tx.categoryId === 'metal'
                  ? ASSETS.metal
                  : tx.categoryId === 'electronic'
                  ? ASSETS.electronic
                  : ASSETS.organic;

              return (
                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={imgUrl}
                        alt={tx.title}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {tx.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {tx.weightKg ? `${tx.weightKg} kg` : tx.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-extrabold block ${
                        tx.type === 'debit' ? 'text-red-500' : 'text-emerald-700'
                      }`}
                    >
                      {tx.type === 'debit' ? `-${tx.amount}` : `+${tx.amount}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {tx.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#0D7C66]" />
                <h3 className="text-base font-bold text-slate-800">
                  {getTranslation(lang, 'withdrawTitle')}
                </h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {withdrawSuccess ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    {getTranslation(lang, 'withdrawSuccess')}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {withdrawAmountUZS} so'm kartangizga o'tkazilmoqda...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-3.5">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{getTranslation(lang, 'withdrawMinNotice')}</span>
                  </div>

                  {withdrawError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                      {withdrawError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {getTranslation(lang, 'withdrawAmountUZS')}
                    </label>
                    <input
                      type="number"
                      step="10000"
                      min="50000"
                      value={withdrawAmountUZS}
                      onChange={(e) => setWithdrawAmountUZS(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      = {Math.ceil(parseInt(withdrawAmountUZS || '0', 10) / coinRate)} EcoCoin
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {getTranslation(lang, 'withdrawCardNumber')}
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="8600 0000 0000 0000"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {getTranslation(lang, 'withdrawCardHolder')}
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0D7C66] hover:bg-[#095848] text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-all mt-2"
                  >
                    {getTranslation(lang, 'withdrawSubmit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Promocode Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">
                {getTranslation(lang, 'promocode')}
              </h3>
              <button
                onClick={() => setShowPromoModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyPromo} className="space-y-3">
              <p className="text-xs text-slate-500">
                Bonus EcoCoin utıw ushın promokodtı kiritiń (mısalı: <span className="font-bold text-emerald-800">ECO2026</span>)
              </p>

              {promoSuccess && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold">
                  {promoSuccess}
                </div>
              )}
              {promoError && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {promoError}
                </div>
              )}

              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="ECO2026"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:outline-none focus:border-emerald-600"
                required
              />

              <button
                type="submit"
                className="w-full py-3 bg-[#0D7C66] text-white font-bold text-xs rounded-xl hover:bg-[#095848] active:scale-95 transition-all"
              >
                {getTranslation(lang, 'applyPromocode')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
