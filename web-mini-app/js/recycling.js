/**
 * CHIQINDI PROJECT — recycling submission service (Phase 6)
 *
 * Implements the core workflow from the project spec:
 *   photo -> waste type -> weight -> estimated reward -> submit -> PENDING
 *   -> (future Admin Panel) APPROVED (credit reward once) / REJECTED (no reward)
 *
 * MVP notes:
 *  - Rates and submissions live in localStorage via js/storage.js. This is a
 *    demo data layer, not a production database — see MVP LIMITATIONS in
 *    the README once written.
 *  - approveSubmission/rejectSubmission are implemented now (idempotent, as
 *    required by the spec) so the Admin Panel phase can call them directly
 *    instead of re-deriving this logic. They are NOT wired to any UI yet —
 *    admin-triggered review happens in a later phase.
 *  - Real anti-fraud/authorization for approval must happen server-side in
 *    a future Netlify Function; this client-side version is for MVP/demo
 *    purposes only.
 */
(function () {
  'use strict';

  var DEFAULT_RATES = {
    paper: 200,
    plastic: 150,
    metal: 50,
    ewaste: 200,
    mixed: 50
  };

  var RATES_STORAGE_KEY = 'chiqindi_waste_rates_v1';
  var MAX_WEIGHT_KG = 500; // MVP sanity ceiling against fat-finger/garbage input

  function getWasteRates() {
    try {
      var raw = window.localStorage.getItem(RATES_STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          var merged = {};
          for (var k in DEFAULT_RATES) merged[k] = DEFAULT_RATES[k];
          for (var k2 in parsed) {
            if (DEFAULT_RATES.hasOwnProperty(k2)) merged[k2] = parsed[k2];
          }
          return merged;
        }
      }
    } catch (err) {
      // fall through to defaults
    }
    var copy = {};
    for (var key in DEFAULT_RATES) copy[key] = DEFAULT_RATES[key];
    return copy;
  }

  function updateWasteRate(type, rate) {
    if (!DEFAULT_RATES.hasOwnProperty(type)) return null;
    rate = Number(rate);
    if (!isFinite(rate) || rate < 0) return null;
    var rates = getWasteRates();
    rates[type] = rate;
    try {
      window.localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
    } catch (err) {
      console.warn('[Chiqindi/recycling] could not persist updated rate:', err);
    }
    return rates;
  }

  function calculateReward(wasteType, weightKg) {
    var rates = getWasteRates();
    var rate = rates[wasteType];
    if (rate === undefined) return null;

    var weight = Number(weightKg);
    if (!isFinite(weight) || weight <= 0) return null;

    var reward = Math.round(weight * rate);
    if (!isFinite(reward) || reward < 0) return null;
    return reward;
  }

  // Returns an array of error codes (empty array = valid).
  function validateSubmission(data) {
    var errors = [];
    if (!data || !data.photo) errors.push('photo');
    if (!data || !data.wasteType || !getWasteRates().hasOwnProperty(data.wasteType)) errors.push('wasteType');

    var weight = data ? Number(data.weightKg) : NaN;
    if (!isFinite(weight) || weight <= 0) {
      errors.push('weight');
    } else if (weight > MAX_WEIGHT_KG) {
      errors.push('weightTooHigh');
    }
    return errors;
  }

  function generateId() {
    return 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
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

  function submitWaste(data) {
    var errors = validateSubmission(data);
    if (errors.length) {
      return { success: false, errors: errors };
    }

    var weight = Number(data.weightKg);
    var rates = getWasteRates();
    var rate = rates[data.wasteType];
    var reward = calculateReward(data.wasteType, weight);

    var submission = {
      id: generateId(),
      userId: getCurrentUserId(),
      photo: data.photo, // data URL - demo/local representation only, see MVP LIMITATIONS
      wasteType: data.wasteType,
      weightKg: weight,
      ratePerKg: rate,
      estimatedReward: reward,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null
    };

    if (window.Chiqindi && window.Chiqindi.storage) {
      window.Chiqindi.storage.saveSubmission(submission);

      var wallet = window.Chiqindi.storage.getWallet();
      wallet.pendingUZS = (wallet.pendingUZS || 0) + reward;
      window.Chiqindi.storage.saveWallet(wallet);
    }

    return { success: true, submission: submission };
  }

  function getSubmissions() {
    if (window.Chiqindi && window.Chiqindi.storage) {
      return window.Chiqindi.storage.getSubmissions();
    }
    return [];
  }

  function getMySubmissions() {
    var userId = getCurrentUserId();
    return getSubmissions().filter(function (s) { return s.userId === userId; });
  }

  // Idempotent: calling this again on an already-reviewed submission is a
  // no-op and returns the existing (unchanged) record - reward is only ever
  // credited once, per spec section 20.
  //
  // Per spec section 24, approved recycling also earns a small flat coin
  // bonus (separate from the UZS reward and from game XP/levels, which are
  // game-specific progression - see js/game.js).
  var APPROVAL_COIN_BONUS = 5;

  function approveSubmission(id, reviewerId) {
    if (!window.Chiqindi || !window.Chiqindi.storage) return null;
    var state = window.Chiqindi.storage.getState();
    var list = state.submissions || [];
    var idx = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { idx = i; break; } }
    if (idx === -1) return null;

    var sub = list[idx];
    if (sub.status !== 'PENDING') {
      return sub; // already APPROVED or REJECTED - idempotent no-op
    }

    sub.status = 'APPROVED';
    sub.reviewedAt = new Date().toISOString();
    sub.reviewedBy = reviewerId || 'admin';
    list[idx] = sub;
    state.submissions = list;

    state.wallet.pendingUZS = Math.max(0, (state.wallet.pendingUZS || 0) - sub.estimatedReward);
    state.wallet.balanceUZS = (state.wallet.balanceUZS || 0) + sub.estimatedReward;
    state.wallet.totalEarnedUZS = (state.wallet.totalEarnedUZS || 0) + sub.estimatedReward;
    state.wallet.coins = (state.wallet.coins || 0) + APPROVAL_COIN_BONUS;

    window.Chiqindi.storage.saveState(state);
    return sub;
  }

  function rejectSubmission(id, reviewerId) {
    if (!window.Chiqindi || !window.Chiqindi.storage) return null;
    var state = window.Chiqindi.storage.getState();
    var list = state.submissions || [];
    var idx = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { idx = i; break; } }
    if (idx === -1) return null;

    var sub = list[idx];
    if (sub.status !== 'PENDING') {
      return sub; // idempotent no-op
    }

    sub.status = 'REJECTED';
    sub.reviewedAt = new Date().toISOString();
    sub.reviewedBy = reviewerId || 'admin';
    list[idx] = sub;
    state.submissions = list;

    state.wallet.pendingUZS = Math.max(0, (state.wallet.pendingUZS || 0) - sub.estimatedReward);

    window.Chiqindi.storage.saveState(state);
    return sub;
  }

  window.Chiqindi = window.Chiqindi || {};
  window.Chiqindi.recycling = {
    getWasteRates: getWasteRates,
    updateWasteRate: updateWasteRate,
    calculateReward: calculateReward,
    validateSubmission: validateSubmission,
    submitWaste: submitWaste,
    getSubmissions: getSubmissions,
    getMySubmissions: getMySubmissions,
    approveSubmission: approveSubmission,
    rejectSubmission: rejectSubmission,
    MAX_WEIGHT_KG: MAX_WEIGHT_KG
  };
})();
