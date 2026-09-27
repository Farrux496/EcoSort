/**
 * CHIQINDI PROJECT — admin service (Phase 9)
 *
 * IMPORTANT SECURITY NOTE (spec section 44):
 * The password gate in this file is a DEMO-ONLY convenience so the admin
 * panel isn't wide open to every visitor during development. It is NOT
 * secure: the "password" ships in client-side JavaScript, anyone can read
 * it by viewing source, and passing this check proves nothing to a real
 * backend. Real admin authentication and authorization MUST happen
 * server-side (e.g. a Netlify Function checking a session/JWT against a
 * real user-role database) before this panel is ever exposed in
 * production. Nothing in this file should be treated as access control
 * for actual data protection.
 *
 * All approve/reject/pay actions below call the SAME idempotent functions
 * already used elsewhere (js/recycling.js, js/wallet.js) - this file does
 * not duplicate or re-implement that business logic, it only aggregates
 * data for the admin views and wires buttons to the existing functions.
 */
(function () {
  'use strict';

  var DEMO_ADMIN_PASSWORD = 'admin123'; // DEMO ONLY - see notice above
  var ADMIN_SESSION_KEY = 'chiqindi_admin_demo_session';

  function isAdminAuthenticated() {
    try {
      return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch (err) {
      return false;
    }
  }

  function loginAsAdmin(password) {
    if (password !== DEMO_ADMIN_PASSWORD) {
      return { success: false, reason: 'invalidPassword' };
    }
    try {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch (err) {
      // sessionStorage unavailable - authentication won't persist across
      // reloads, but let the caller proceed for this page view.
    }
    return { success: true };
  }

  function logoutAdmin() {
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (err) {
      // non-fatal
    }
  }

  function getAllSubmissions() {
    if (window.Chiqindi && window.Chiqindi.recycling) {
      return window.Chiqindi.recycling.getSubmissions();
    }
    return [];
  }

  function getAllWithdrawals() {
    if (window.Chiqindi && window.Chiqindi.wallet) {
      return window.Chiqindi.wallet.getWithdrawals();
    }
    return [];
  }

  function getAllUsers() {
    var subs = getAllSubmissions();
    var withdrawals = getAllWithdrawals();
    var users = {};

    subs.forEach(function (s) {
      if (!users[s.userId]) users[s.userId] = { userId: s.userId, submissions: 0, totalKg: 0, totalEarnedUZS: 0, withdrawals: 0 };
      users[s.userId].submissions += 1;
      users[s.userId].totalKg += Number(s.weightKg) || 0;
      if (s.status === 'APPROVED') users[s.userId].totalEarnedUZS += s.estimatedReward || 0;
    });

    withdrawals.forEach(function (w) {
      if (!users[w.userId]) users[w.userId] = { userId: w.userId, submissions: 0, totalKg: 0, totalEarnedUZS: 0, withdrawals: 0 };
      users[w.userId].withdrawals += 1;
    });

    return Object.keys(users).map(function (id) { return users[id]; });
  }

  function getDashboardStats() {
    var subs = getAllSubmissions();
    var withdrawals = getAllWithdrawals();

    var stats = {
      totalSubmissions: subs.length,
      pendingSubmissions: 0,
      approvedSubmissions: 0,
      rejectedSubmissions: 0,
      totalRewardedUZS: 0,
      totalPendingWithdrawals: 0,
      totalWithdrawalsPendingUZS: 0,
      totalUsers: getAllUsers().length
    };

    subs.forEach(function (s) {
      if (s.status === 'PENDING') stats.pendingSubmissions += 1;
      else if (s.status === 'APPROVED') {
        stats.approvedSubmissions += 1;
        stats.totalRewardedUZS += s.estimatedReward || 0;
      } else if (s.status === 'REJECTED') stats.rejectedSubmissions += 1;
    });

    withdrawals.forEach(function (w) {
      if (w.status === 'PENDING') {
        stats.totalPendingWithdrawals += 1;
        stats.totalWithdrawalsPendingUZS += w.amountUZS || 0;
      }
    });

    return stats;
  }

  function getGameStats() {
    // Aggregated across whatever's in this browser's localStorage (MVP -
    // single-device demo data only, see MVP LIMITATIONS in the README).
    if (!window.Chiqindi || !window.Chiqindi.storage) {
      return { level: 1, xp: 0, totalCoinsEarned: 0, coins: 0 };
    }
    var state = window.Chiqindi.storage.getState();
    var game = state.game || {};
    var wallet = state.wallet || {};
    return {
      level: game.level || 1,
      xp: game.xp || 0,
      totalCoinsEarned: game.totalCoinsEarned || 0,
      coins: wallet.coins || 0,
      missionsCompleted: (game.missionsCompleted || []).length
    };
  }

  // Rate management delegates entirely to recycling.js's existing
  // getWasteRates()/updateWasteRate() - no separate rate store here.
  function getWasteRates() {
    if (window.Chiqindi && window.Chiqindi.recycling) {
      return window.Chiqindi.recycling.getWasteRates();
    }
    return {};
  }

  function updateWasteRate(type, rate) {
    if (window.Chiqindi && window.Chiqindi.recycling) {
      return window.Chiqindi.recycling.updateWasteRate(type, rate);
    }
    return null;
  }

  window.Chiqindi = window.Chiqindi || {};
  window.Chiqindi.admin = {
    isAdminAuthenticated: isAdminAuthenticated,
    loginAsAdmin: loginAsAdmin,
    logoutAdmin: logoutAdmin,
    getAllSubmissions: getAllSubmissions,
    getAllWithdrawals: getAllWithdrawals,
    getAllUsers: getAllUsers,
    getDashboardStats: getDashboardStats,
    getGameStats: getGameStats,
    getWasteRates: getWasteRates,
    updateWasteRate: updateWasteRate
  };
})();
