export type Language = 'kaa' | 'uz' | 'ru';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string; // e.g. "#ES10234"
  email: string;
  fullName: string;
  phone: string;
  region: string;
  district: string;
  street: string;
  houseNumber: string;
  avatar: string;
  balance: number; // EcoCoins
  totalRecycledKg: number;
  totalSubmissionsCount: number;
  xp: number;
  maxXp: number;
  level: number;
  levelTitle: string;
  role: UserRole;
  joinedDate: string;
}

export type WasteCategoryId = 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic';

export interface WasteCategory {
  id: WasteCategoryId;
  nameKey: string;
  descriptionKey: string;
  ratePerKg: number; // EcoCoin per kg
  image: string;
  color: string;
  tagKey: string;
  co2PerKg: number; // kg CO2 saved per kg
}

export type CourierType = 'tezkor' | 'haftalik';

export type CourierStatus = 'Kútilmekte' | 'Belgilenǵen' | 'Jolǵa shıqtı' | 'Alıp ketildi';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  categoryId: WasteCategoryId;
  categoryName: string;
  weightKg: number;
  coinsEarned: number;
  imageUrl: string;
  courierType: CourierType;
  courierDate: string;
  courierTime: string;
  address: string;
  status: SubmissionStatus;
  courierStatus: CourierStatus;
  createdAt: string;
  rejectionReason?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  categoryId?: WasteCategoryId;
  weightKg?: number;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  time?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly';
  titleKey: string;
  reward: number; // EcoCoins
  current: number;
  target: number;
  unit: string;
  completed: boolean;
  claimed: boolean;
  iconName: 'scan' | 'weight' | 'share' | 'game' | 'tree' | 'streak';
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amountUZS: number;
  ecoCoins: number;
  cardNumber: string;
  cardHolder: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  processedDate?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  titleKey: string;
  countRequired: number;
  currentCount: number;
  unlocked: boolean;
  issueDate?: string;
  certificateCode: string;
  tier: 'bronze' | 'gold';
}

export interface RecyclingLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  statusKey: string;
  coords: { x: number; y: number }; // Relative map coordinates 0-100%
  acceptedTypes: WasteCategoryId[];
  phone: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'waste_approved' | 'waste_rejected' | 'coin_received' | 'mission_completed' | 'level_up' | 'certificate_unlocked' | 'courier_scheduled' | 'courier_status' | 'withdrawal';
  date: string;
  read: boolean;
}

export interface GameItem {
  id: string;
  name: { kaa: string; uz: string; ru: string };
  category: WasteCategoryId;
  image: string;
  funFact: { kaa: string; uz: string; ru: string };
}
