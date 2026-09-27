/**
 * CHIQINDI PROJECT — Eco Clicker game service (Phase 8)
 *
 * Gamification layer from the project spec: click-to-earn coins, upgrades
 * with passive income, daily reward, missions/achievements, levels.
 *
 * Economy is deliberately small and bounded (spec section 27):
 *  - Manual clicks are capped per day (no unlimited clicking)
 *  - Passive/offline income is capped to a maximum accumulation window
 *    (no leaving the tab open for a week and coming back rich)
 *  - Upgrade costs scale up with each purchase
 *  - Coins never auto-convert to UZS - this is a separate currency
 *    (spec section 25); only approved recycling and withdrawals touch
 *    wallet.balanceUZS
 *
 * Missions and Achievements are implemented as a single unified list for
 * MVP simplicity (spec section 5: don't over-engineer) rather than two
 * parallel systems - each entry is claimed at most once (idempotent).
 */
(function () {
  'use strict';

  var UPGRADES = {
    recyclingMachine: { baseCost: 50, cps: 0.1 },
    recyclingPlant: { baseCost: 200, cps: 0.5 },
    wasteTruck: { baseCost: 500, cps: 1 },
    sortingCenter: { baseCost: 1500, cps: 3 },
    ecoFactory: { baseCost: 5000, cps: 8 }
  };

  var COST_MULTIPLIER = 1.15;
  var MAX_CLICKS_PER_DAY = 200;
  var MAX_OFFLINE_SECONDS = 3600; // 1 hour cap on passive/offline accumulation
  var DAILY_REWARD_COINS = 20;
  var XP_PER_LEVEL = 100;

  var MISSIONS = [
    { id: 'first_waste', reward: 30, check: function (ctx) { return ctx.mySubmissions.length >= 1; } },
    { id: 'recycle_5kg', reward: 50, check: function (ctx) { return ctx.totalKg >= 5; } },
    { id: 'recycle_10kg', reward: 100, check: function (ctx) { return ctx.totalKg >= 10; } },
    { id: 'play_today', reward: 10, check: function () { return true; } }, // satisfied simply by visiting the game page
    { id: 'earn_100_coins', reward: 40, check: function (ctx) { return ctx.game.totalCoinsEarned >= 100; } },
    { id: 'level_5', reward: 150, check: function (ctx) { return ctx.game.level >= 5; } }
  ];

  function defaultGameState() {
    return {
      xp: 0,
      level: 1,
      totalCoinsEarned: 0,
      upgrades: { recyclingMachine: 0, recyclingPlant: 0, wasteTruck: 0, sortingCenter: 0, ecoFactory: 0 },
      lastTickAt: null,
      clicksToday: 0,
      clicksDate: null,
      dailyRewardClaimedDate: null,
      missionsCompleted: []
    };
  }

  function getGameState() {
    if (!window.Chiqindi || !window.Chiqindi.storage) return defaultGameState();
    var state = window.Chiqindi.storage.getState();
    var def = defaultGameState();
    var game = (state.game && typeof state.game === 'object') ? state.game : {};
    for (var k in def) {
      if (game[k] === undefined) game[k] = def[k];
    }
    if (!game.upgrades || typeof game.upgrades !== 'object') game.upgrades = def.upgrades;
    for (var uk in def.upgrades) {
      if (game.upgrades[uk] === undefined) game.upgrades[uk] = 0;
    }
    if (!Array.isArray(game.missionsCompleted)) game.missionsCompleted = [];
    return game;
  }

  function saveGameState(game) {
    if (!window.Chiqindi || !window.Chiqindi.storage) return;
    var state = window.Chiqindi.storage.getState();
    state.game = game;
    window.Chiqindi.storage.saveState(state);
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function getUpgradeCost(type, ownedCount) {
    var def = UPGRADES[type];
    if (!def) return null;
    return Math.round(def.baseCost * Math.pow(COST_MULTIPLIER, ownedCount));
  }

  function getTotalCPS(game) {
    var total = 0;
    for (var type in UPGRADES) {
      var owned = (game.upgrades && game.upgrades[type]) || 0;
      total += owned * UPGRADES[type].cps;
    }
    return total;
  }

  // Adds coins to the wallet and updates game XP/level. This is the ONLY
  // place game XP changes, so level progression always matches coins
  // actually earned through the game.
  function addCoins(amount) {
    amount = Math.max(0, Math.round(amount));
    if (amount <= 0) return;

    if (window.Chiqindi && window.Chiqindi.storage) {
      var wallet = window.Chiqindi.storage.getWallet();
      wallet.coins = (wallet.coins || 0) + amount;
      window.Chiqindi.storage.saveWallet(wallet);
    }

    var game = getGameState();
    game.totalCoinsEarned = (game.totalCoinsEarned || 0) + amount;
    game.xp = (game.xp || 0) + amount;
    game.level = Math.floor(game.xp / XP_PER_LEVEL) + 1;
    saveGameState(game);
  }

  // Computes and credits passive income accumulated since the last tick,
  // capped at MAX_OFFLINE_SECONDS so leaving the app open/closed for a long
  // time never produces an unbounded payout. Call this once when the game
  // page loads.
  function applyOfflineProgress() {
    var game = getGameState();
    var now = Date.now();

    if (!game.lastTickAt) {
      game.lastTickAt = new Date(now).toISOString();
      saveGameState(game);
      return 0;
    }

    var last = new Date(game.lastTickAt).getTime();
    var elapsedSec = Math.max(0, (now - last) / 1000);
    elapsedSec = Math.min(elapsedSec, MAX_OFFLINE_SECONDS);

    var cps = getTotalCPS(game);
    var earned = elapsedSec * cps;

    game.lastTickAt = new Date(now).toISOString();
    saveGameState(game);

    if (earned >= 1) addCoins(earned);
    return earned;
  }

  function click() {
    var game = getGameState();
    var today = todayStr();

    if (game.clicksDate !== today) {
      game.clicksDate = today;
      game.clicksToday = 0;
    }

    if (game.clicksToday >= MAX_CLICKS_PER_DAY) {
      return { success: false, reason: 'dailyLimitReached', clicksToday: game.clicksToday, maxClicks: MAX_CLICKS_PER_DAY };
    }

    game.clicksToday += 1;
    saveGameState(game);
    addCoins(1);

    return {
      success: true,
      clicksToday: game.clicksToday,
      clicksRemaining: MAX_CLICKS_PER_DAY - game.clicksToday
    };
  }

  function buyUpgrade(type) {
    if (!UPGRADES[type]) return { success: false, reason: 'invalidUpgrade' };

    var game = getGameState();
    var owned = game.upgrades[type] || 0;
    var cost = getUpgradeCost(type, owned);

    var wallet = window.Chiqindi && window.Chiqindi.storage ? window.Chiqindi.storage.getWallet() : { coins: 0 };
    if ((wallet.coins || 0) < cost) {
      return { success: false, reason: 'insufficientCoins', cost: cost };
    }

    wallet.coins -= cost;
    if (window.Chiqindi && window.Chiqindi.storage) window.Chiqindi.storage.saveWallet(wallet);

    game.upgrades[type] = owned + 1;
    saveGameState(game);

    return { success: true, newCount: owned + 1, cost: cost, nextCost: getUpgradeCost(type, owned + 1) };
  }

  function claimDailyReward() {
    var game = getGameState();
    var today = todayStr();

    if (game.dailyRewardClaimedDate === today) {
      return { success: false, reason: 'alreadyClaimed' };
    }

    game.dailyRewardClaimedDate = today;
    saveGameState(game);
    addCoins(DAILY_REWARD_COINS);

    return { success: true, coins: DAILY_REWARD_COINS };
  }

  function getMissionContext() {
    var subs = (window.Chiqindi && window.Chiqindi.recycling) ? window.Chiqindi.recycling.getMySubmissions() : [];
    var totalKg = 0;
    subs.forEach(function (s) { totalKg += Number(s.weightKg) || 0; });
    return { mySubmissions: subs, totalKg: totalKg, game: getGameState() };
  }

  function getMissionsStatus() {
    var ctx = getMissionContext();
    return MISSIONS.map(function (m) {
      var completed = ctx.game.missionsCompleted.indexOf(m.id) !== -1;
      var eligible = !completed && m.check(ctx);
      return { id: m.id, reward: m.reward, completed: completed, eligible: eligible };
    });
  }

  // Idempotent: claiming an already-claimed mission is a no-op.
  function claimMission(id) {
    var mission = null;
    for (var i = 0; i < MISSIONS.length; i++) {
      if (MISSIONS[i].id === id) { mission = MISSIONS[i]; break; }
    }
    if (!mission) return { success: false, reason: 'invalidMission' };

    var game = getGameState();
    if (game.missionsCompleted.indexOf(id) !== -1) {
      return { success: false, reason: 'alreadyClaimed' };
    }

    var ctx = getMissionContext();
    if (!mission.check(ctx)) {
      return { success: false, reason: 'notEligible' };
    }

    game.missionsCompleted.push(id);
    saveGameState(game);
    if (mission.reward > 0) addCoins(mission.reward);

    return { success: true, reward: mission.reward };
  }

  window.Chiqindi = window.Chiqindi || {};
  window.Chiqindi.game = {
    UPGRADES: UPGRADES,
    MAX_CLICKS_PER_DAY: MAX_CLICKS_PER_DAY,
    DAILY_REWARD_COINS: DAILY_REWARD_COINS,
    XP_PER_LEVEL: XP_PER_LEVEL,
    getGameState: getGameState,
    getUpgradeCost: getUpgradeCost,
    getTotalCPS: getTotalCPS,
    applyOfflineProgress: applyOfflineProgress,
    click: click,
    buyUpgrade: buyUpgrade,
    claimDailyReward: claimDailyReward,
    getMissionsStatus: getMissionsStatus,
    claimMission: claimMission
  };
})();
