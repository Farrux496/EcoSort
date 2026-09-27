/**
 * CHIQINDI PROJECT — centralized storage layer (Phase 6+)
 *
 * All localStorage access for app data goes through this single module,
 * per the project spec: "Do NOT scatter random localStorage calls across
 * dozens of files." Other scripts (recycling.js, wallet.js, game.js, ...)
 * call these functions instead of touching localStorage directly.
 *
 * This is an MVP data layer. When a real backend (Netlify Functions + DB)
 * is introduced, these functions are the only place that needs to change —
 * the rest of the app calls window.Chiqindi.storage.* and doesn't know or
 * care whether the data comes from localStorage or an API.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'chiqindi_state_v1';

  function defaultState() {
    return {
      user: {},
      language: 'uz',
      wallet: {
        balanceUZS: 0,
        pendingUZS: 0,
        totalEarnedUZS: 0,
        totalWithdrawnUZS: 0,
        coins: 0
      },
      submissions: [],
      withdrawals: [],
      game: {},
      missions: [],
      achievements: []
    };
  }

  function getState() {
    var base = defaultState();
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return base;
      // Shallow-merge so fields added in later phases don't break old saved state.
      for (var key in base) {
        if (parsed[key] === undefined) parsed[key] = base[key];
      }
      if (!parsed.wallet || typeof parsed.wallet !== 'object') parsed.wallet = base.wallet;
      for (var wKey in base.wallet) {
        if (parsed.wallet[wKey] === undefined) parsed.wallet[wKey] = base.wallet[wKey];
      }
      return parsed;
    } catch (err) {
      console.warn('[Chiqindi/storage] getState failed, using default state:', err);
      return base;
    }
  }

  function saveState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.warn('[Chiqindi/storage] saveState failed (storage full or unavailable):', err);
      return false;
    }
  }

  function getSubmissions() {
    return getState().submissions || [];
  }

  function saveSubmission(submission) {
    var state = getState();
    state.submissions = state.submissions || [];
    state.submissions.push(submission);
    saveState(state);
    return submission;
  }

  function updateSubmission(id, patch) {
    var state = getState();
    var list = state.submissions || [];
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return null;
    for (var k in patch) { list[idx][k] = patch[k]; }
    state.submissions = list;
    saveState(state);
    return list[idx];
  }

  function getWallet() {
    return getState().wallet;
  }

  function saveWallet(wallet) {
    var state = getState();
    state.wallet = wallet;
    saveState(state);
    return wallet;
  }

  window.Chiqindi = window.Chiqindi || {};
  window.Chiqindi.storage = {
    getState: getState,
    saveState: saveState,
    getSubmissions: getSubmissions,
    saveSubmission: saveSubmission,
    updateSubmission: updateSubmission,
    getWallet: getWallet,
    saveWallet: saveWallet
  };
})();
