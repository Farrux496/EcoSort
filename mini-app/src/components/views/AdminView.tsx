import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  Target,
  BarChart3,
  ShieldAlert,
  ArrowLeft,
  Coins,
  Recycle,
  Sparkles,
} from 'lucide-react';
import { Language, Submission, User, Withdrawal, Mission } from '../../types';
import { getTranslation } from '../../services/translations';
import { StorageService } from '../../services/storage';

interface AdminViewProps {
  adminUser: User;
  lang: Language;
  onBack: () => void;
  onRefreshData?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  adminUser,
  lang,
  onBack,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'couriers' | 'withdrawals' | 'users'>('overview');
  const [submissions, setSubmissions] = useState<Submission[]>(StorageService.getSubmissions());
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(StorageService.getWithdrawals());
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  // Metrics
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const totalKgGlobal = submissions
    .filter((s) => s.status === 'approved')
    .reduce((acc, s) => acc + s.weightKg, 0);
  const totalCoinsGlobal = submissions
    .filter((s) => s.status === 'approved')
    .reduce((acc, s) => acc + s.coinsEarned, 0);

  // Approve waste submission handler
  const handleApproveSubmission = (sub: Submission) => {
    // 1. Update submission status
    StorageService.updateSubmission(sub.id, {
      status: 'approved',
      courierStatus: 'Alıp ketildi',
    });

    // 2. Award EcoCoins, XP, Recycled Kg, Count to user
    const allUsers = StorageService.getUsers();
    const userToUpdate = allUsers.find((u) => u.id === sub.userId) || allUsers[0];

    const newKg = Number((userToUpdate.totalRecycledKg + sub.weightKg).toFixed(1));
    const newCount = userToUpdate.totalSubmissionsCount + 1;
    const newCoins = userToUpdate.balance + sub.coinsEarned;
    const newXp = userToUpdate.xp + Math.round(sub.coinsEarned / 2);

    let newLevel = userToUpdate.level;
    let newLevelTitle = userToUpdate.levelTitle;
    let newMaxXp = userToUpdate.maxXp;

    if (newXp >= userToUpdate.maxXp) {
      newLevel += 1;
      newMaxXp = Math.round(userToUpdate.maxXp * 1.5);
      if (newLevel === 4) newLevelTitle = 'EcoQaharman';
      else if (newLevel >= 5) newLevelTitle = 'EcoMaster';
    }

    const updatedUserObj: User = {
      ...userToUpdate,
      balance: newCoins,
      totalRecycledKg: newKg,
      totalSubmissionsCount: newCount,
      xp: newXp,
      maxXp: newMaxXp,
      level: newLevel,
      levelTitle: newLevelTitle,
    };
    StorageService.setCurrentUser(updatedUserObj);

    // 3. Update Mission Progress automatically
    const missions = StorageService.getMissions();
    const updatedMissions = missions.map((m) => {
      let currentVal = m.current;
      if (m.titleKey === 'missionSubmit10') {
        currentVal = Math.min(m.target, currentVal + 1);
      } else if (m.titleKey === 'missionPlastic5kg' && sub.categoryId === 'plastic') {
        currentVal = Math.min(m.target, currentVal + sub.weightKg);
      } else if (m.titleKey === 'missionWeekly20kg') {
        currentVal = Math.min(m.target, currentVal + sub.weightKg);
      }
      const completed = currentVal >= m.target;
      return { ...m, current: currentVal, completed };
    });
    StorageService.updateMissions(updatedMissions);

    // 4. Update Certificates automatically (count >= 100 or 1000)
    const certificates = StorageService.getCertificates();
    const updatedCerts = certificates.map((cert) => {
      const unlocked = newCount >= cert.countRequired;
      return {
        ...cert,
        currentCount: newCount,
        unlocked,
        issueDate: unlocked && !cert.issueDate ? new Date().toLocaleDateString() : cert.issueDate,
      };
    });
    StorageService.updateCertificates(updatedCerts);

    // 5. Create Transaction
    StorageService.addTransaction({
      id: `tx-appr-${Date.now()}`,
      userId: sub.userId,
      title: `${sub.categoryName} tastıyıqlandı`,
      categoryId: sub.categoryId,
      weightKg: sub.weightKg,
      amount: sub.coinsEarned,
      type: 'credit',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString().slice(0, 5),
      status: 'completed',
    });

    // 6. Create Notification
    StorageService.addNotification({
      id: `notif-appr-${Date.now()}`,
      userId: sub.userId,
      title: 'Qaldıq tastıyıqlandı! 🎉',
      message: `${sub.weightKg} kg ${sub.categoryName} tastıyıqlandı. +${sub.coinsEarned} EcoCoin berildi!`,
      type: 'waste_approved',
      date: new Date().toLocaleDateString(),
      read: false,
    });

    setSubmissions(StorageService.getSubmissions());
    showAlert(`Qaldıq tastıyıqlandı! +${sub.coinsEarned} EcoCoin paydalanıwshıǵa ótkerildi.`);
    if (onRefreshData) onRefreshData();
  };

  const handleRejectSubmission = (sub: Submission) => {
    StorageService.updateSubmission(sub.id, {
      status: 'rejected',
      courierStatus: 'Alıp ketildi',
    });

    StorageService.addNotification({
      id: `notif-rej-${Date.now()}`,
      userId: sub.userId,
      title: 'Qaldıq qabıllanbadı',
      message: `${sub.weightKg} kg ${sub.categoryName} kórsetilgen talaplarǵa tuwra kelmegeni sebepli bas tartıldı.`,
      type: 'waste_rejected',
      date: new Date().toLocaleDateString(),
      read: false,
    });

    setSubmissions(StorageService.getSubmissions());
    showAlert('Qaldıq bas tartıldı.');
  };

  const handleUpdateCourierStatus = (subId: string, newStatus: Submission['courierStatus']) => {
    StorageService.updateSubmission(subId, { courierStatus: newStatus });
    setSubmissions(StorageService.getSubmissions());
    showAlert(`Kuryer statusı ózgertildi: ${newStatus}`);
  };

  const handleApproveWithdrawal = (w: Withdrawal) => {
    StorageService.updateWithdrawal(w.id, {
      status: 'approved',
      processedDate: new Date().toLocaleDateString(),
    });

    StorageService.addNotification({
      id: `notif-w-appr-${Date.now()}`,
      userId: w.userId,
      title: 'Pul shıǵarıw tastıyıqlandı! 💳',
      message: `${w.amountUZS.toLocaleString()} so'm ${w.cardNumber} kartasıńızǵa tabıslı awdarıldı.`,
      type: 'withdrawal',
      date: new Date().toLocaleDateString(),
      read: false,
    });

    setWithdrawals(StorageService.getWithdrawals());
    showAlert(`Pul shıǵarıw tastıyıqlandı (${w.amountUZS} so'm)`);
  };

  const handleRejectWithdrawal = (w: Withdrawal) => {
    StorageService.updateWithdrawal(w.id, {
      status: 'rejected',
      processedDate: new Date().toLocaleDateString(),
    });

    // Refund coins back to user
    const allUsers = StorageService.getUsers();
    const userToRefund = allUsers.find((u) => u.id === w.userId) || allUsers[0];
    const refundedUser: User = {
      ...userToRefund,
      balance: userToRefund.balance + w.ecoCoins,
    };
    StorageService.setCurrentUser(refundedUser);

    StorageService.addNotification({
      id: `notif-w-rej-${Date.now()}`,
      userId: w.userId,
      title: 'Pul shıǵarıw biykar etildi',
      message: `${w.ecoCoins} EcoCoin balansıńızǵa qaytarıldı. Karta maǵlıwmatların qaytadan tekseriń.`,
      type: 'withdrawal',
      date: new Date().toLocaleDateString(),
      read: false,
    });

    setWithdrawals(StorageService.getWithdrawals());
    showAlert('Pul shıǵarıw bas tartıldı hám EcoCoin qaytarıldı.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Admin Header */}
      <header className="px-5 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <span>{getTranslation(lang, 'adminPanel')}</span>
            </h1>
            <span className="text-[11px] text-slate-400">
              {adminUser.fullName} (Administrator)
            </span>
          </div>
        </div>

        {alertMessage && (
          <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs rounded-full animate-pulse">
            {alertMessage}
          </div>
        )}
      </header>

      {/* Admin Navigation Tabs */}
      <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard' },
          { id: 'submissions', label: `Qaldıqlar (${pendingSubmissions.length})` },
          { id: 'couriers', label: 'Kuryerler' },
          { id: 'withdrawals', label: `Pul shıǵarıw (${pendingWithdrawals.length})` },
          { id: 'users', label: 'Paydalanıwshılar' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#0D7C66] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Jámi qaldıq</span>
                <span className="text-xl font-black text-emerald-400">
                  {totalKgGlobal.toFixed(1)} kg
                </span>
              </div>
              <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Berilgen bonus</span>
                <span className="text-xl font-black text-amber-400">
                  {totalCoinsGlobal.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Kútilmekte</span>
                <span className="text-xl font-black text-blue-400">
                  {pendingSubmissions.length} qaldıq
                </span>
              </div>
              <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Shıǵarıw sorawı</span>
                <span className="text-xl font-black text-purple-400">
                  {pendingWithdrawals.length} soraw
                </span>
              </div>
            </div>

            {/* Recent Pending Actions */}
            <div className="bg-slate-800 rounded-3xl p-4 border border-slate-700 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tekseriw kútilip atırǵan qaldıqlar
              </h3>
              {pendingSubmissions.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  Barlıq qaldıqlar tastıyıqlanǵan!
                </p>
              ) : (
                pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={sub.imageUrl}
                          alt={sub.categoryName}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {sub.categoryName} · {sub.weightKg} kg
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {sub.userName} ({sub.address})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApproveSubmission(sub)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tastıyıqlaw</span>
                      </button>
                      <button
                        onClick={() => handleRejectSubmission(sub)}
                        className="p-1.5 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ALL SUBMISSIONS VERIFICATION */}
        {activeTab === 'submissions' && (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-800 rounded-2xl p-4 border border-slate-700 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 p-1 flex items-center justify-center">
                      <img
                        src={sub.imageUrl}
                        alt={sub.categoryName}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        {sub.categoryName} ({sub.weightKg} kg)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {sub.userName} · {sub.createdAt}
                      </p>
                      <span className="text-[11px] text-amber-400 font-bold block mt-0.5">
                        🪙 +{sub.coinsEarned} EcoCoin
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : sub.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                {sub.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t border-slate-700">
                    <button
                      onClick={() => handleApproveSubmission(sub)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{getTranslation(lang, 'approve')} (+{sub.coinsEarned})</span>
                    </button>
                    <button
                      onClick={() => handleRejectSubmission(sub)}
                      className="px-4 py-2 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs rounded-xl"
                    >
                      {getTranslation(lang, 'reject')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: COURIERS MANAGEMENT */}
        {activeTab === 'couriers' && (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-800 rounded-2xl p-4 border border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white">
                      {sub.courierType === 'tezkor' ? '⚡ TEZKOR KURYER' : '📅 HAFTALIK KURYER'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {sub.courierDate} · {sub.courierTime}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {sub.userName} · {sub.address}
                </p>

                <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Status:</span>
                  <div className="flex gap-1.5">
                    {(['Kútilmekte', 'Belgilenǵen', 'Jolǵa shıqtı', 'Alıp ketildi'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateCourierStatus(sub.id, st)}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                            sub.courierStatus === st
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-3">
            {withdrawals.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                Házirshe pul shıǵarıw sorawları joq
              </p>
            ) : (
              withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="bg-slate-800 rounded-2xl p-4 border border-slate-700 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        {w.amountUZS.toLocaleString()} so'm
                      </h4>
                      <p className="text-xs text-amber-400 font-medium">
                        {w.ecoCoins.toLocaleString()} EcoCoin
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {w.userName} · {w.cardNumber}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        w.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : w.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  {w.status === 'pending' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-700">
                      <button
                        onClick={() => handleApproveWithdrawal(w)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                      >
                        {getTranslation(lang, 'approve')}
                      </button>
                      <button
                        onClick={() => handleRejectWithdrawal(w)}
                        className="px-4 py-2 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs rounded-xl"
                      >
                        {getTranslation(lang, 'reject')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: USERS */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                    {u.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{u.fullName}</h4>
                    <span className="text-[11px] text-slate-400">
                      {u.id} · {u.phone}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 block">
                    🪙 {u.balance.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-400">
                    {u.totalRecycledKg} kg qayta islendi
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
