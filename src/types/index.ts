export type DailyCondition = 'great' | 'good' | 'okay' | 'tired' | 'fever';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rain' | 'low_pressure' | 'cold';

export interface ExerciseChecklist {
  chairSquats: boolean;      // 椅子立ち座り (Chair Squats)
  towelGather: boolean;      // タオルギャザー (Towel Gather)
  husbandSoleCare: boolean;  // ご主人の包み込みケア (Gentle Sole Touch by Husband)
  tensTherapy: boolean;      // 低周波TENS (TENS Low-frequency therapy)
  calfStretch: boolean;      // ふくらはぎ＆足首ストレッチ (Calf & Ankle Stretch)
  walking: boolean;          // お散歩・室内歩行
}

export interface DailyLog {
  id: string;
  date: string;               // YYYY-MM-DD
  condition: DailyCondition;  // 5段階のコンディション
  fatigueLevel: number;       // 易疲労感 (1:元気 〜 5:とてもだるい)
  painVas: number;            // しびれ・痛み VAS (0:全くなし 〜 10:耐えがたい痛み)
  allodyniaLevel: number;     // アロディニア・触刺激痛 (0:なし, 1:ピリピリ, 2:靴下で痛む, 3:触れるだけで激痛)
  painLocations: string[];    // 痛む部位 (足裏全体, つま先, 踵, 足首, etc.)
  exercises: ExerciseChecklist;
  pslDoseMg: number;          // プレドニン(ステロイド)内服量 mg
  bodyTemp?: number;          // 朝の体温 ℃
  stepCount?: number;         // 歩数
  weather: WeatherCondition;  // お天気・気圧
  oshiEnergy: number;         // 推し活エネルギー / ハニ度 (10〜100%)
  memo: string;               // メモ・推し活日記
  createdAt: string;
}

export interface MMTScore {
  tibialisAnterior: number;        // 前脛骨筋 (足関節背屈 / 下垂足チェック) 0-5
  extensorHallucisLongus: number;  // 長母趾伸筋 (親指の背屈) 0-5
  gastrocnemiusSoleus: number;     // 下腿三頭筋 (底屈・つま先立ち) 0-5
  quadriceps: number;              // 大腿四頭筋 (膝伸展・立ち座り) 0-5
}

export interface PTEvalDock {
  id: string;
  date: string;               // 評価日 YYYY-MM-DD
  evaluator: string;          // 評価者 (例: 和宏先生 - PT)
  mmt: MMTScore;
  functional: {
    cs30Count: number;                 // 30秒椅子立ち座りテスト (回数)
    singleLegHeelRaiseLeft: number;    // 左片足カーフレイズ (回)
    singleLegHeelRaiseRight: number;   // 右片足カーフレイズ (回)
    rombergTest: 'pass' | 'mild_sway' | 'severe_sway'; // ロンベルグ試験 (Pass / 軽度動揺 / 著名な動揺)
  };
  calfCircumference: {
    rightCm: number;  // 右下腿最大周径 cm
    leftCm: number;   // 左下腿最大周径 cm
  };
  sensoryZones: string[];     // 感覚低下・アロディニア部位 ['heel', 'midfoot', 'toes', 'ankle', 'calf']
  allodyniaScore: number;     // アロディニア重症度 (0-10)
  kazuhiroAdvice: string;     // 和宏先生からの評価所見・アドバイス
  nextGoal: string;           // 次回までの目標
  createdAt: string;
}

export interface HaniQuote {
  id: string;
  quote: string;
  subtext: string;
  emoji: string;
  category: 'cheer' | 'rehab' | 'love' | 'rest';
}
