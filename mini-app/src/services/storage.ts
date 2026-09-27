import {
  Certificate,
  GameItem,
  Language,
  Mission,
  NotificationItem,
  RecyclingLocation,
  Submission,
  Transaction,
  User,
  WasteCategory,
  WasteCategoryId,
  Withdrawal
} from '../types';

import landscapeImg from '../assets/images/karakalpakstan_landscape_1790485994445.jpg';
import mascotImg from '../assets/images/eco_mascot_1790486009538.jpg';
import avatarImg from '../assets/images/user_avatar_profile_1790486102478.jpg';
import plasticImg from '../assets/images/waste_pet_bottle_1790486022410.jpg';
import paperImg from '../assets/images/waste_paper_cardboard_1790486064225.jpg';
import glassImg from '../assets/images/waste_glass_bottles_1790486078270.jpg';
import metalImg from '../assets/images/waste_metal_cans_1790486037516.jpg';
import organicImg from '../assets/images/waste_organic_waste_1790486090701.jpg';
import electronicImg from '../assets/images/waste_electronic_1790486049728.jpg';

export const ASSETS = {
  landscape: landscapeImg,
  mascot: mascotImg,
  avatar: avatarImg,
  plastic: plasticImg,
  paper: paperImg,
  glass: glassImg,
  metal: metalImg,
  organic: organicImg,
  electronic: electronicImg,
};

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 'plastic',
    nameKey: 'cat_plastic',
    descriptionKey: 'recyclableBadge',
    ratePerKg: 100,
    image: ASSETS.plastic,
    color: '#0D9488',
    tagKey: 'PET, HDPE',
    co2PerKg: 1.5,
  },
  {
    id: 'paper',
    nameKey: 'cat_paper',
    descriptionKey: 'recyclableBadge',
    ratePerKg: 80,
    image: ASSETS.paper,
    color: '#B45309',
    tagKey: 'karton, gazeta',
    co2PerKg: 0.9,
  },
  {
    id: 'glass',
    nameKey: 'cat_glass',
    descriptionKey: 'recyclableBadge',
    ratePerKg: 100,
    image: ASSETS.glass,
    color: '#059669',
    tagKey: 'butılka, banka',
    co2PerKg: 0.3,
  },
  {
    id: 'metal',
    nameKey: 'cat_metal',
    descriptionKey: 'recyclableBadge',
    ratePerKg: 70,
    image: ASSETS.metal,
    color: '#64748B',
    tagKey: 'alyuminiy, tunika',
    co2PerKg: 2.1,
  },
  {
    id: 'organic',
    nameKey: 'cat_organic',
    descriptionKey: 'compostableBadge',
    ratePerKg: 50,
    image: ASSETS.organic,
    color: '#16A34A',
    tagKey: 'shash, miywe-palız',
    co2PerKg: 0.5,
  },
  {
    id: 'electronic',
    nameKey: 'cat_electronic',
    descriptionKey: 'specialRecycleBadge',
    ratePerKg: 150,
    image: ASSETS.electronic,
    color: '#4F46E5',
    tagKey: 'qurılmalar, plata',
    co2PerKg: 3.2,
  },
];

export const GAME_ITEMS: GameItem[] = [
  {
    id: 'g-1',
    name: {
      kaa: 'Suw butılkası (PET)',
      uz: 'Suv shishasi (PET)',
      ru: 'Пластиковая бутылка (PET)'
    },
    category: 'plastic',
    image: ASSETS.plastic,
    funFact: {
      kaa: '1 tonna plastikti qayta islew 2 600 litr neftti únemleydi!',
      uz: '1 tonna plastikni qayta ishlash 2 600 litr neftni tejaydi!',
      ru: 'Переработка 1 тонны пластика экономит 2600 литров нефти!'
    }
  },
  {
    id: 'g-2',
    name: {
      kaa: 'Karton qutı',
      uz: 'Karton quti',
      ru: 'Картонная коробка'
    },
    category: 'paper',
    image: ASSETS.paper,
    funFact: {
      kaa: 'Qáǵazdı qayta islew 17 terek hám 26 000 litr suwdı saqlap qaladı.',
      uz: 'Qog‘ozni qayta ishlash 17 daraxt va 26 000 litr suvni asraydi.',
      ru: 'Переработка бумаги спасает 17 деревьев и 26 000 литров воды.'
    }
  },
  {
    id: 'g-3',
    name: {
      kaa: 'Kók shisha butılka',
      uz: 'Yashil shisha butilka',
      ru: 'Зелёная стеклянная бутылка'
    },
    category: 'glass',
    image: ASSETS.glass,
    funFact: {
      kaa: 'Shishanı sheksiz mártebe qayta islewge boladı, sapası hesh buzılmaydı.',
      uz: 'Shishani cheksiz marta qayta ishlash mumkin, sifati yo‘qolmaydi.',
      ru: 'Стекло можно перерабатывать бесконечно без потери качества.'
    }
  },
  {
    id: 'g-4',
    name: {
      kaa: 'Alyuminiy banka',
      uz: 'Alyuminiy quti',
      ru: 'Алюминиевая банка'
    },
    category: 'metal',
    image: ASSETS.metal,
    funFact: {
      kaa: 'Alyuminiydi qayta islew jańadan alıwǵa qaraǵanda 95% kem energiya talap etedi.',
      uz: 'Alyuminiyni qayta ishlash yangisini olishdan 95% kamroq energiya sarflaydi.',
      ru: 'Переработка алюминия требует на 95% меньше энергии, чем его добыча.'
    }
  },
  {
    id: 'g-5',
    name: {
      kaa: 'Alma qaldıǵı hám qabıǵı',
      uz: 'Olma po‘sti va qoldig‘i',
      ru: 'Огрызок яблока и кожура'
    },
    category: 'organic',
    image: ASSETS.organic,
    funFact: {
      kaa: 'Organik qaldıqlardan tayarlanǵan kompost topıraqtı qunarlı etedi.',
      uz: 'Organik chiqindilardan tayyorlangan kompost tuproqni unumdor qiladi.',
      ru: 'Компост из органических отходов обогащает почву минералами.'
    }
  },
  {
    id: 'g-6',
    name: {
      kaa: 'Eski plata hám klaviatura',
      uz: 'Eski plata va klaviatura',
      ru: 'Старая плата и клавиатура'
    },
    category: 'electronic',
    image: ASSETS.electronic,
    funFact: {
      kaa: 'Elektron qaldıqlarda altın, gúmis hám qımbat bahalı metallar bar.',
      uz: 'Elektron chiqindilarda oltin, kumush va qimmatbaho metallar mavjud.',
      ru: 'В электронной технике содержатся ценные металлы, включая золото.'
    }
  }
];

export const INITIAL_LOCATIONS: RecyclingLocation[] = [
  {
    id: 'loc-1',
    name: 'Nókis EkoMarkaz',
    address: 'M. Ájiniyaz kóshesi, 45',
    distance: '1.2 km',
    hours: 'Ashıq · 09:00 - 18:00',
    statusKey: 'workingHours',
    coords: { x: 48, y: 52 },
    acceptedTypes: ['plastic', 'paper', 'glass', 'metal', 'electronic'],
    phone: '+998 61 224 10 20'
  },
  {
    id: 'loc-2',
    name: 'Toza Hudud Markaziy Qabıllaw Nuktası',
    address: 'Gárezsizlik gúzarı, 18',
    distance: '2.5 km',
    hours: 'Ashıq · 08:30 - 19:00',
    statusKey: 'workingHours',
    coords: { x: 35, y: 38 },
    acceptedTypes: ['plastic', 'paper', 'glass', 'metal', 'organic', 'electronic'],
    phone: '+998 61 222 55 11'
  },
  {
    id: 'loc-3',
    name: 'Qaraqalpaqstan Eko-Park punktı',
    address: 'Doslıq kóshesi, 7',
    distance: '3.1 km',
    hours: 'Ashıq · 10:00 - 20:00',
    statusKey: 'workingHours',
    coords: { x: 62, y: 32 },
    acceptedTypes: ['plastic', 'glass', 'metal'],
    phone: '+998 61 229 04 12'
  },
  {
    id: 'loc-4',
    name: 'Saralaw stantsiyası #4',
    address: 'Erkin Qaraqalpaqstan kóshesi, 92',
    distance: '4.0 km',
    hours: 'Ashıq · 09:00 - 17:00',
    statusKey: 'workingHours',
    coords: { x: 74, y: 65 },
    acceptedTypes: ['paper', 'electronic', 'metal'],
    phone: '+998 61 223 90 88'
  }
];

export const INITIAL_USER: User = {
  id: '#ES10234',
  email: 'demo@ecosort.local',
  fullName: 'Farrux Mardonov',
  phone: '+998 90 123 45 67',
  region: 'Nókis qalası',
  district: 'Oraylıq rayon',
  street: 'M. Ájiniyaz kóshesi',
  houseNumber: '12',
  avatar: ASSETS.avatar,
  balance: 12450,
  totalRecycledKg: 58.0,
  totalSubmissionsCount: 87,
  xp: 250,
  maxXp: 500,
  level: 3,
  levelTitle: 'Jasıl dos',
  role: 'user',
  joinedDate: '2026-03-15'
};

export const INITIAL_ADMIN: User = {
  id: '#ES00001',
  email: 'admin@ecosort.local',
  fullName: 'EcoSort Administrator',
  phone: '+998 61 222 33 44',
  region: 'Nókis qalası',
  district: 'Oraylıq rayon',
  street: 'Gárezsizlik gúzarı',
  houseNumber: '1',
  avatar: ASSETS.avatar,
  balance: 500000,
  totalRecycledKg: 2450.0,
  totalSubmissionsCount: 940,
  xp: 4500,
  maxXp: 5000,
  level: 5,
  levelTitle: 'EcoMaster',
  role: 'admin',
  joinedDate: '2026-01-01'
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: '#ES10234',
    title: 'Plastik (PET)',
    categoryId: 'plastic',
    weightKg: 5.0,
    amount: 500,
    type: 'credit',
    date: '24.09.2026',
    time: '14:32',
    status: 'completed'
  },
  {
    id: 'tx-2',
    userId: '#ES10234',
    title: 'Qáǵaz',
    categoryId: 'paper',
    weightKg: 3.0,
    amount: 300,
    type: 'credit',
    date: '23.09.2026',
    time: '11:15',
    status: 'completed'
  },
  {
    id: 'tx-3',
    userId: '#ES10234',
    title: 'Shisha',
    categoryId: 'glass',
    weightKg: 4.0,
    amount: 400,
    type: 'credit',
    date: '22.09.2026',
    time: '16:48',
    status: 'completed'
  },
  {
    id: 'tx-4',
    userId: '#ES10234',
    title: 'Metall',
    categoryId: 'metal',
    weightKg: 2.0,
    amount: 150,
    type: 'credit',
    date: '21.09.2026',
    time: '09:20',
    status: 'completed'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm-1',
    type: 'daily',
    titleKey: 'missionScan1',
    reward: 50,
    current: 1,
    target: 1,
    unit: '',
    completed: true,
    claimed: true,
    iconName: 'scan'
  },
  {
    id: 'm-2',
    type: 'daily',
    titleKey: 'missionPlastic5kg',
    reward: 100,
    current: 0,
    target: 5,
    unit: 'kg',
    completed: false,
    claimed: false,
    iconName: 'weight'
  },
  {
    id: 'm-3',
    type: 'daily',
    titleKey: 'missionSharePost',
    reward: 50,
    current: 0,
    target: 1,
    unit: '',
    completed: false,
    claimed: false,
    iconName: 'share'
  },
  {
    id: 'm-4',
    type: 'daily',
    titleKey: 'missionSubmit10',
    reward: 200,
    current: 3,
    target: 10,
    unit: '',
    completed: false,
    claimed: false,
    iconName: 'tree'
  },
  {
    id: 'm-5',
    type: 'weekly',
    titleKey: 'missionGame10',
    reward: 150,
    current: 6,
    target: 10,
    unit: '',
    completed: false,
    claimed: false,
    iconName: 'game'
  },
  {
    id: 'm-6',
    type: 'weekly',
    titleKey: 'missionWeekly20kg',
    reward: 300,
    current: 8,
    target: 20,
    unit: 'kg',
    completed: false,
    claimed: false,
    iconName: 'streak'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-100',
    userId: '#ES10234',
    userName: 'Farrux Mardonov',
    titleKey: 'certificate100Title',
    countRequired: 100,
    currentCount: 87,
    unlocked: false,
    certificateCode: 'ES-CERT-100-87291',
    tier: 'bronze'
  },
  {
    id: 'cert-1000',
    userId: '#ES10234',
    userName: 'Farrux Mardonov',
    titleKey: 'certificate1000Title',
    countRequired: 1000,
    currentCount: 87,
    unlocked: false,
    certificateCode: 'ES-CERT-1000-00104',
    tier: 'gold'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-101',
    userId: '#ES10234',
    userName: 'Farrux Mardonov',
    categoryId: 'plastic',
    categoryName: 'Plastik (PET)',
    weightKg: 5.0,
    coinsEarned: 500,
    imageUrl: ASSETS.plastic,
    courierType: 'haftalik',
    courierDate: '24.09.2026',
    courierTime: '10:00 - 12:00',
    address: 'Nókis q., M. Ájiniyaz kóshesi, 12',
    status: 'approved',
    courierStatus: 'Alıp ketildi',
    createdAt: '2026-09-24 09:30'
  },
  {
    id: 'sub-102',
    userId: '#ES10234',
    userName: 'Farrux Mardonov',
    categoryId: 'paper',
    categoryName: 'Qáǵaz (karton)',
    weightKg: 3.0,
    coinsEarned: 300,
    imageUrl: ASSETS.paper,
    courierType: 'haftalik',
    courierDate: '23.09.2026',
    courierTime: '14:00 - 16:00',
    address: 'Nókis q., M. Ájiniyaz kóshesi, 12',
    status: 'approved',
    courierStatus: 'Alıp ketildi',
    createdAt: '2026-09-23 11:00'
  },
  {
    id: 'sub-103',
    userId: '#ES10234',
    userName: 'Farrux Mardonov',
    categoryId: 'plastic',
    categoryName: 'Plastik (PET)',
    weightKg: 35.0,
    coinsEarned: 3500,
    imageUrl: ASSETS.plastic,
    courierType: 'tezkor',
    courierDate: '27.09.2026',
    courierTime: '15:00 - 17:00',
    address: 'Nókis q., M. Ájiniyaz kóshesi, 12',
    status: 'pending',
    courierStatus: 'Belgilenǵen',
    createdAt: '2026-09-26 18:20'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: '#ES10234',
    title: 'Qaldıq tastıyıqlandı!',
    message: '5 kg Plastik (PET) qabıllandı hám 500 EcoCoin balansıńızǵa qosıldı.',
    type: 'waste_approved',
    date: '24.09.2026 14:35',
    read: false
  },
  {
    id: 'notif-2',
    userId: '#ES10234',
    title: 'Topshırıq orınlandı!',
    message: '«1 qaldıqtı skanlaw» topshırigı orınlandı. 50 EcoCoin aldınız.',
    type: 'mission_completed',
    date: '24.09.2026 10:15',
    read: false
  },
  {
    id: 'notif-3',
    userId: '#ES10234',
    title: 'Tezkor kuryer qabıllandı',
    message: '35 kg plastik ushın tezkor kuryer sorawı belgilenǵen keste boyınsha tastıyıqlandı.',
    type: 'courier_scheduled',
    date: '26.09.2026 18:25',
    read: false
  }
];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'w-1',
    userId: '#ES10234',
    userName: 'Farrux Mardonov',
    amountUZS: 50000,
    ecoCoins: 5000,
    cardNumber: '8600 **** **** 4812',
    cardHolder: 'Farrux Mardonov',
    status: 'approved',
    date: '20.09.2026',
    processedDate: '20.09.2026'
  }
];

export const StorageService = {
  // Init
  init() {
    if (!localStorage.getItem('ecosort_users')) {
      localStorage.setItem('ecosort_users', JSON.stringify([INITIAL_USER, INITIAL_ADMIN]));
    }
    if (!localStorage.getItem('ecosort_user')) {
      localStorage.setItem('ecosort_user', JSON.stringify(INITIAL_USER));
    }
    if (!localStorage.getItem('ecosort_submissions')) {
      localStorage.setItem('ecosort_submissions', JSON.stringify(INITIAL_SUBMISSIONS));
    }
    if (!localStorage.getItem('ecosort_transactions')) {
      localStorage.setItem('ecosort_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }
    if (!localStorage.getItem('ecosort_missions')) {
      localStorage.setItem('ecosort_missions', JSON.stringify(INITIAL_MISSIONS));
    }
    if (!localStorage.getItem('ecosort_certificates')) {
      localStorage.setItem('ecosort_certificates', JSON.stringify(INITIAL_CERTIFICATES));
    }
    if (!localStorage.getItem('ecosort_notifications')) {
      localStorage.setItem('ecosort_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem('ecosort_withdrawals')) {
      localStorage.setItem('ecosort_withdrawals', JSON.stringify(INITIAL_WITHDRAWALS));
    }
    if (!localStorage.getItem('ecosort_language')) {
      localStorage.setItem('ecosort_language', 'kaa');
    }
  },

  // Language
  getLanguage(): Language {
    return (localStorage.getItem('ecosort_language') as Language) || 'kaa';
  },
  setLanguage(lang: Language) {
    localStorage.setItem('ecosort_language', lang);
  },

  // User
  getCurrentUser(): User | null {
    const raw = localStorage.getItem('ecosort_user');
    return raw ? JSON.parse(raw) : null;
  },
  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem('ecosort_user', JSON.stringify(user));
      // update in users list too
      const users = this.getUsers();
      const idx = users.findIndex(u => u.email === user.email || u.id === user.id);
      if (idx >= 0) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem('ecosort_users', JSON.stringify(users));
    } else {
      localStorage.removeItem('ecosort_user');
    }
  },
  getUsers(): User[] {
    const raw = localStorage.getItem('ecosort_users');
    return raw ? JSON.parse(raw) : [INITIAL_USER, INITIAL_ADMIN];
  },

  // Submissions
  getSubmissions(): Submission[] {
    const raw = localStorage.getItem('ecosort_submissions');
    return raw ? JSON.parse(raw) : INITIAL_SUBMISSIONS;
  },
  addSubmission(sub: Submission) {
    const subs = this.getSubmissions();
    subs.unshift(sub);
    localStorage.setItem('ecosort_submissions', JSON.stringify(subs));
  },
  updateSubmission(id: string, updates: Partial<Submission>) {
    const subs = this.getSubmissions();
    const idx = subs.findIndex(s => s.id === id);
    if (idx >= 0) {
      subs[idx] = { ...subs[idx], ...updates };
      localStorage.setItem('ecosort_submissions', JSON.stringify(subs));
    }
  },

  // Transactions
  getTransactions(): Transaction[] {
    const raw = localStorage.getItem('ecosort_transactions');
    return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS;
  },
  addTransaction(tx: Transaction) {
    const txs = this.getTransactions();
    txs.unshift(tx);
    localStorage.setItem('ecosort_transactions', JSON.stringify(txs));
  },

  // Missions
  getMissions(): Mission[] {
    const raw = localStorage.getItem('ecosort_missions');
    return raw ? JSON.parse(raw) : INITIAL_MISSIONS;
  },
  updateMissions(missions: Mission[]) {
    localStorage.setItem('ecosort_missions', JSON.stringify(missions));
  },

  // Certificates
  getCertificates(): Certificate[] {
    const raw = localStorage.getItem('ecosort_certificates');
    return raw ? JSON.parse(raw) : INITIAL_CERTIFICATES;
  },
  updateCertificates(certs: Certificate[]) {
    localStorage.setItem('ecosort_certificates', JSON.stringify(certs));
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem('ecosort_notifications');
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  },
  addNotification(notif: NotificationItem) {
    const notifs = this.getNotifications();
    notifs.unshift(notif);
    localStorage.setItem('ecosort_notifications', JSON.stringify(notifs));
  },
  markNotificationsAsRead() {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem('ecosort_notifications', JSON.stringify(updated));
  },

  // Withdrawals
  getWithdrawals(): Withdrawal[] {
    const raw = localStorage.getItem('ecosort_withdrawals');
    return raw ? JSON.parse(raw) : INITIAL_WITHDRAWALS;
  },
  addWithdrawal(w: Withdrawal) {
    const list = this.getWithdrawals();
    list.unshift(w);
    localStorage.setItem('ecosort_withdrawals', JSON.stringify(list));
  },
  updateWithdrawal(id: string, updates: Partial<Withdrawal>) {
    const list = this.getWithdrawals();
    const idx = list.findIndex(w => w.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem('ecosort_withdrawals', JSON.stringify(list));
    }
  },

  // High score in game
  getHighScore(): number {
    return Number(localStorage.getItem('ecosort_high_score') || 0);
  },
  setHighScore(score: number) {
    const current = this.getHighScore();
    if (score > current) {
      localStorage.setItem('ecosort_high_score', String(score));
    }
  }
};
