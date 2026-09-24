// 認証ロール定義 (オシャレな呼称)
export type UserRole = 'admin' | 'provider' | 'customer';

export interface RoleMeta {
  role: UserRole;
  label: string;          // 表示名 (オシャレ呼称)
  subLabel: string;       // 役割解説
  badge: string;          // バッジ
  icon: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleMeta> = {
  admin: {
    role: 'admin',
    label: 'Cheer Master',
    subLabel: 'HQ Studio (最高統括・プラットフォーム管理)',
    badge: 'MASTER HQ 👑',
    icon: '👑',
  },
  provider: {
    role: 'provider',
    label: 'Pro Partner',
    subLabel: 'Partner Studio (事業者・コーチ・専属講師)',
    badge: 'PRO PARTNER 🏢',
    icon: '🏢',
  },
  customer: {
    role: 'customer',
    label: 'My Lounge',
    subLabel: 'Personal Space (メンバー専用ダイアリー)',
    badge: 'MEMBER 💎',
    icon: '💎',
  },
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;      // provider または customer の所属業者ID
  customerId?: string;    // customer の場合の顧客ID
  avatarUrl?: string;
  description?: string;
}

// プリセット・デモアカウント一覧
export const DEMO_ACCOUNTS: AuthUser[] = [
  // 1. Cheer Master (管理者)
  {
    id: 'user-admin-01',
    email: 'kotsuka@creativesd.net',
    name: 'Cheer HQ 管理部',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    description: '全提携業者の統括・新規発行・全顧客アクセス',
  },

  // 2. Pro Partner (業者) - CARAT 公式ケア
  {
    id: 'user-partner-carat',
    email: 'kotsuka@creativesd.net',
    name: 'CARAT オフィシャルケア担当',
    role: 'provider',
    tenantId: 'tenant-carat-hisa',
    avatarUrl: '/jeonghan_photo.jpg',
    description: 'ひさこ様のリハビリ＆推し活ケア伴走担当',
  },

  // 3. Pro Partner (業者) - NEXT-FITNESS (ダミー)
  {
    id: 'user-partner-fit',
    email: 'fitness@partner.cheer.app',
    name: 'NEXT-FITNESS KENJIコーチ',
    role: 'provider',
    tenantId: 'tenant-fitness-pro',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    description: 'パーソナルジム会員のトレーニング管理 (ダミー)',
  },

  // 4. Pro Partner (業者) - 未来アカデミー (ダミー)
  {
    id: 'user-partner-edu',
    email: 'academy@partner.cheer.app',
    name: '未来アカデミー 美咲先生',
    role: 'provider',
    tenantId: 'tenant-study-academy',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    description: '個別指導塾生の学習記録＆面談サポート (ダミー)',
  },

  // 5. My Lounge (顧客) - ひさこ様
  {
    id: 'user-cust-hisa',
    email: 'hisako@user.cheer.app',
    name: 'ひさこ',
    role: 'customer',
    tenantId: 'tenant-carat-hisa',
    customerId: 'cust-hisa-01',
    avatarUrl: '/jeonghan_photo.jpg',
    description: '推し活＆EGPAセルフケアダイアリー',
  },

  // 6. My Lounge (顧客) - 田中 健太郎様
  {
    id: 'user-cust-tanaka',
    email: 'tanaka@user.cheer.app',
    name: '田中 健太郎',
    role: 'customer',
    tenantId: 'tenant-fitness-pro',
    customerId: 'cust-fit-tanaka',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description: 'NEXT-FITNESS 筋トレ＆ボディメイク手帳',
  },

  // 7. My Lounge (顧客) - 佐藤 颯太様
  {
    id: 'user-cust-souta',
    email: 'souta@user.cheer.app',
    name: '佐藤 颯太',
    role: 'customer',
    tenantId: 'tenant-study-academy',
    customerId: 'cust-edu-souta',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    description: '未来アカデミー 志望校突破ノート',
  },
];
