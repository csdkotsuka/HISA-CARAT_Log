import type { DailyCondition, WeatherCondition } from './index';

// 5大業界カテゴリー
export type IndustryGroup =
  | 'medical_care'   // 1. 医療・福祉・ケア (訪問看護, 障がい者支援, 整体, デイサービス)
  | 'field_ops'      // 2. 現場・建設・フィールド (造園・外構, ビルメンテ, 遊漁船, 林業)
  | 'local_service'  // 3. 地域密着・ライフサービス (ペットサロン, 車整備, 寺院・儀礼)
  | 'edu_community'  // 4. 教育・実践コミュニティ・BtoB (個別学習塾, 実習ポータル, 地域営農)
  | 'cheer_personal';// 5. 推し活・ウェルネス・パーソナル (アイドル推し活, ジム, ヨガ)

// 業界種別詳細
export type IndustryType =
  // 医療・福祉
  | 'visiting_nurse'      // 訪問看護・介護ステーション
  | 'welfare_support'     // 障がい者就労支援・放デイ
  | 'orthopedic_clinic'   // 接骨院・整体院
  | 'day_service'         // 小規模デイサービス
  | 'healthcare'          // 一般医療・リハビリ
  // 現場・フィールド
  | 'landscaping_const'   // 造園・外構・建設
  | 'building_clean'      // ビルメンテ・清掃
  | 'fishing_boat'        // 小型船・釣り船・遊漁船
  | 'forestry_safety'     // 林業・山林安全
  // 地域密着
  | 'pet_salon'           // ペットサロン・トリミング
  | 'auto_repair'         // 自動車整備・板金
  | 'temple_ceremony'     // 寺院・神社・儀礼
  // 教育・コミュニティ
  | 'private_tutoring'    // 個別学習塾・家庭教師
  | 'internship_portal'   // 実習・インターンポータル
  | 'farm_sharing'        // 農業・農機具シェア
  | 'community'           // 地域サークル・健康会
  // 推し活・パーソナル
  | 'idol'                // 推し活・ファンコミュニティ
  | 'fitness'             // パーソナルジム・フィットネス
  | 'wellness'            // ヨガ・ウェルネス
  | 'beauty'              // エステ・サロン
  | 'coaching'            // ビジネス・コーチング
  | 'education'           // スクール一般
  | 'custom';             // カスタム

// カテゴリ情報メタデータ
export interface CategoryGroupMeta {
  id: IndustryGroup;
  title: string;
  subTitle: string;
  icon: string;
  color: string;
  badge: string;
  description: string;
}

export const INDUSTRY_GROUPS: CategoryGroupMeta[] = [
  {
    id: 'medical_care',
    title: '医療・福祉・ケア',
    subTitle: '現場知見×リアルタイム連携',
    icon: '🩺',
    color: '#0D9488',
    badge: 'Medical & Care',
    description: '訪問看護、障がい者就労支援、整体、デイサービスなど、毎日のバイタルや支援記録・関係者共有に特化',
  },
  {
    id: 'field_ops',
    title: '現場・建設・フィールド',
    subTitle: '位置情報×現場動態共有',
    icon: '🏗️',
    color: '#EA580C',
    badge: 'Field & Ops',
    description: '造園、外構、ビルメンテ、遊漁船、林業など、写真付き日報や安全管理・リアルタイム動態をスマート化',
  },
  {
    id: 'local_service',
    title: '地域密着・ライフサービス',
    subTitle: '個体カルテ×リピート支援',
    icon: '✂️',
    color: '#8B5CF6',
    badge: 'Local Service',
    description: 'ペットサロン、自動車整備工場、寺院・納骨堂など、細やかな履歴管理と次回予約・アフターフォローを両立',
  },
  {
    id: 'edu_community',
    title: '教育・実習・コミュニティ',
    subTitle: '成長伴走×多角連携',
    icon: '🎓',
    color: '#2563EB',
    badge: 'Edu & BtoB',
    description: '個別塾の保護者連携、大学×企業インターン実習、農機具シェアなど、関係者を1つのタイムラインでつなぐ',
  },
  {
    id: 'cheer_personal',
    title: '推し活・ウェルネス・自己実現',
    subTitle: 'エナジーチャージ＆伴走',
    icon: '💎',
    color: '#EC4899',
    badge: 'Cheer & Life',
    description: '推し活ダイアリー、パーソナルトレーニング、ヨガ習慣化など、毎日に寄り添いモチベーションを最大化',
  },
];

// カラーテーマ定義
export interface ColorTheme {
  id: string;
  name: string;
  industry: IndustryType;
  group: IndustryGroup;
  primaryColor: string;     // メインアクセント (HEX)
  secondaryColor: string;   // サブカラー (HEX)
  accentColor: string;      // ハイライト (HEX)
  bgGradient: string;       // 背景グラデーション (Tailwind / CSS)
  headerGradient: string;   // ヘッダー背景
  cardBg: string;           // カード背景
  borderStyle: string;      // 枠線スタイル
  badgeBg: string;          // バッジカラー
}

// AIペルソナ設定
export interface AIPersonaQuote {
  id: string;
  quote: string;
  subtext: string;
  emoji: string;
  category?: string;
}

export interface AIPersonaConfig {
  name: string;
  role: string;               // 例: '専属アイドル', 'チーフトレーナー', '訪問リーダー', '担任の美咲先生'
  tone: 'friendly' | 'polite' | 'passionate' | 'gentle' | 'cool'; // 口調
  avatarUrl: string;          // アバター画像のURLまたはDataURL
  avatarType: 'upload' | 'preset' | 'ai_generated';
  aiPromptSnippet?: string;   // AI生成時のプロンプト
  speechBubbleText: string;   // タップ時に喋るひとこと
  encouragementQuotes: AIPersonaQuote[];
}

// 日々の記録項目のカスタマイズ定義
export interface DailyCheckItemDef {
  id: string;
  label: string;
  icon?: string;
  defaultChecked?: boolean;
  category?: string;
}

export interface DailySliderDef {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  defaultValue: number;
}

export interface DailyNumericDef {
  id: string;
  label: string;
  unit: string;
  placeholder?: string;
  defaultValue?: number;
}

export interface DailyConfig {
  title: string;
  enableCondition: boolean;
  conditionLabel: string;
  enableWeather: boolean;
  checkItems: DailyCheckItemDef[];
  sliders: DailySliderDef[];
  numericFields: DailyNumericDef[];
  energyLabel: string;
  energyIcon: string;
  enableEnergy: boolean;
  memoLabel: string;
  memoPlaceholder: string;
  quickTags: string[];
}

// 定期評価項目のカスタマイズ定義
export interface EvalMetricDef {
  id: string;
  label: string;
  category: string;
  unit: string;
  target?: number;
  type: 'score5' | 'number' | 'text';
  description?: string;
}

export interface PeriodicEvalConfig {
  enabled: boolean;
  title: string;
  evaluatorLabel: string;
  metrics: EvalMetricDef[];
  adviceLabel: string;
  goalLabel: string;
}

// 業者（Tenant / Provider）エンティティ
export interface Tenant {
  id: string;                 // 業者ID (例: 'tenant-carat-hisa', 'tenant-visiting-nurse')
  adminId: string;            // 管理者ID ('admin-master')
  name: string;               // 業者名・屋号
  industry: IndustryType;
  group: IndustryGroup;       // 5大カテゴリー
  headerTitle: string;        // 顧客ページの見出し
  headerSubtitle: string;     // 顧客ページのサブ見出し
  badgeText: string;          // ヘッダー上のバッジ
  theme: ColorTheme;
  aiPersona: AIPersonaConfig;
  dailyConfig: DailyConfig;
  evalConfig: PeriodicEvalConfig;
  customerIds: string[];      // 紐づく顧客IDリスト
  status: 'active' | 'trial' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

// 顧客（Customer）エンティティ
export interface Customer {
  id: string;                 // 顧客ID (例: 'cust-hisa-01', 'cust-tanaka-02')
  tenantId: string;           // 所属する業者ID
  name: string;               // 顧客氏名
  nickname?: string;          // 呼称
  joinedDate: string;
  customGoal?: string;        // 顧客の個別目標
  status: 'active' | 'inactive';
}

// 汎用日々の記録データ
export interface GenericDailyLog {
  id: string;
  customerId: string;
  tenantId: string;
  date: string;
  condition?: DailyCondition;
  weather?: WeatherCondition;
  checkStates: Record<string, boolean>;
  sliderValues: Record<string, number>;
  numericValues: Record<string, number>;
  energyLevel?: number;
  memo: string;
  createdAt: string;
}

// 汎用定期評価データ
export interface GenericEvalRecord {
  id: string;
  customerId: string;
  tenantId: string;
  date: string;
  evaluator: string;
  metricValues: Record<string, any>;
  advice: string;
  nextGoal: string;
  createdAt: string;
}
