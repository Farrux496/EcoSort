/**
 * CHIQINDI PROJECT — wallet service (Phase 7)
 *
 * Balance display + withdrawal request workflow from the project spec:
 *   Wallet -> Withdraw -> Amount -> Card/payment destination -> Submit
 *   -> PENDING -> (future Admin Panel) APPROVED -> PAID / REJECTED
 *
 * MVP LIMITATION (spec section 31): withdrawal is simulated. No real money
 * is ever sent. approveWithdrawal()/markWithdrawalPaid() exist now (and are
 * idempotent, per spec section 20) so the Admin Panel phase can call them
 * directly, but nothing here talks to a real payment provider.
 *
 * XP / Coin / UZS stay separate concepts (spec section 25) - this file only
 * ever touches wallet.balanceUZS / pendingUZS / totalEarnedUZS /
 * totalWithdrawnUZS. Coins are a separate field, earned elsewhere (Game /
 * Missions phase), and are never auto-converted to UZS here.
 */
(function () {
  'use strict';

  var MIN_WITHDRAWAL_UZS = 50000;

  function getWallet() {
    if (window.Chiqindi && window.Chiqindi.storage) {
      return window.Chiqindi.storage.getWallet();
    }
    return { balanceUZS: 0, pendingUZS: 0, totalEarnedUZS: 0, totalWithdrawnUZS: 0, coins: 0 };
  }

  function getCurrentUserId() {
    try {
      var tg = window.Chiqindi && window.Chiqindi.telegram;
      if (tg && tg.user) {
        if (tg.user.id) return String(tg.user.id);
        if (tg.user.username) return tg.user.username;
      }
    } catch (err) {
      // ignore
    }
    return 'demo';
  }

  function getWithdrawals() {
    if (window.Chiqindi && window.Chiqindi.storage) {
      return window.Chiqindi.storage.getState().withdrawals || [];
    }
    return [];
  }

  function getMyWithdrawals() {
    var userId = getCurrentUserId();
    return getWithdrawals().filter(function (w) { return w.userId === userId; });
  }

  // Returns an array of error codes (empty array = valid).
  function validateWithdrawal(amount, destination) {
    var errors = [];
    var amt = Number(amount);

    if (!isFinite(amt) || amt <= 0) {
      errors.push('amount');
    } else if (amt < MIN_WITHDRAWAL_UZS) {
      errors.push('belowMinimum');
    } else {
      var wallet = getWallet();
      if (amt > (wallet.balanceUZS || 0)) {
        errors.push('insufficientBalance');
      }
    }

    if (!destination || !String(destination).trim()) {
      errors.push('destination');
    }

    return errors;
  }

  function generateId() {
    return 'wd_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function requestWithdrawal(amount, destination) {
    var errors = validateWithdrawal(amount, destination);
    if (errors.length) {
      return { success: false, errors: errors };
    }

    var amt = Number(amount);
    var withdrawal = {
      id: generateId(),
      userId: getCurrentUserId(),
      amountUZS: amt,
      // Demo-only destination label (e.g. masked card). Never store full
      // card numbers or real payment credentials - see spec section 32.
      destination: String(destination).trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      paidAt: null
    };

    if (window.Chiqindi && window.Chiqindi.storage) {
      var state = window.Chiqindi.storage.getState();
      state.withdrawals = state.withdrawals || [];
      state.withdrawals.push(withdrawal);
      // Reserve the requested amount immediately so it can't be withdrawn
      // twice while this request is still pending review.
      state.wallet.balanceUZS = Math.max(0, (state.wallet.balanceUZS || 0) - amt);
      window.Chiqindi.storage.saveState(state);
    }

    return { success: true, withdrawal: withdrawal };
  }

  function findWithdrawal(state, id) {
    var list = state.withdrawals || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return i;
    }
    return -1;
  }

  // Idempotent: PENDING -> APPROVED exactly once.
  function approveWithdrawal(id, reviewerId) {
    if (!window.Chiqindi || !window.Chiqindi.storage) return null;
    var state = window.Chiqindi.storage.getState();
    var idx = findWithdrawal(state, id);
    if (idx === -1) return null;

    var w = state.withdrawals[idx];
    if (w.status !== 'PENDING') return w; // idempotent no-op

    w.status = 'APPROVED';
    w.reviewedAt = new Date().toISOString();
    w.reviewedBy = reviewerId || 'admin';
    state.withdrawals[idx] = w;
    window.Chiqindi.storage.saveState(state);
    return w;
  }

  // Idempotent: APPROVED -> PAID exactly once. This is the only place
  // totalWithdrawnUZS increases, and only ever by one withdrawal's amount,
  // exactly once - matching the "duplicate payout impossible" requirement.
  function markWithdrawalPaid(id) {
    if (!window.Chiqindi || !window.Chiqindi.storage) return null;
    var state = window.Chiqindi.storage.getState();
    var idx = findWithdrawal(state, id);
    if (idx === -1) return null;

    var w = state.withdrawals[idx];
    if (w.status !== 'APPROVED') return w; // idempotent no-op (must be approved first, and only once)

    w.status = 'PAID';
    w.paidAt = new Date().toISOString();
    state.withdrawals[idx] = w;
    state.wallet.totalWithdrawnUZS = (state.wallet.totalWithdrawnUZS || 0) + w.amountUZS;
    window.Chiqindi.storage.saveState(state);
    return w;
  }

  // Idempotent: PENDING -> REJECTED exactly once, refunds the reserved balance.
  function rejectWithdrawal(id, reviewerId) {
    if (!window.Chiqindi || !window.Chiqindi.storage) return null;
    var state = window.Chiqindi.storage.getState();
    var idx = findWithdrawal(state, id);
    if (idx === -1) return null;

    var w = state.withdrawals[idx];
    if (w.status !== 'PENDING') return w; // idempotent no-op

    w.status = 'REJECTED';
    w.reviewedAt = new Date().toISOString();
    w.reviewedBy = reviewerId || 'admin';
    state.withdrawals[idx] = w;
    state.wallet.balanceUZS = (state.wallet.balanceUZS || 0) + w.amountUZS;
    window.Chiqindi.storage.saveState(state);
    return w;
  }

  window.Chiqindi = window.Chiqindi || {};
  window.Chiqindi.wallet = {
    getWallet: getWallet,
    getWithdrawals: getWithdrawals,
    getMyWithdrawals: getMyWithdrawals,
    validateWithdrawal: validateWithdrawal,
    requestWithdrawal: requestWithdrawal,
    approveWithdrawal: approveWithdrawal,
    markWithdrawalPaid: markWithdrawalPaid,
    rejectWithdrawal: rejectWithdrawal,
    MIN_WITHDRAWAL_UZS: MIN_WITHDRAWAL_UZS
  };
})();
