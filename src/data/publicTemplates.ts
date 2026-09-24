/**
 * publicTemplates.ts
 * コンシューマー向け公開テンプレートのプリセットデータ。
 * Masterコンソールで管理され、新規ユーザーが自分のログスタイルを選択するために使用する。
 * ※ テナント（業者）コレクションとは独立した別コレクション。
 */
import type { PublicTemplate } from '../types/tenant';
import { COLOR_THEMES } from './tenantPresets';

const today = new Date().toISOString().slice(0, 10);

export const PUBLIC_TEMPLATES: PublicTemplate[] = [
  // ① 基本 健康管理ログ（医療・慢性疾患向け）
  {
    id: 'tmpl-health-basic',
    name: '基本 健康管理ログ',
    description: '体調・体温・血圧・服薬などを毎日記録。慢性疾患のセルフケアや通院記録に最適です。',
    emoji: '🏥',
    category: 'healthcare',
    headerTitle: 'わたしの健康ログ',
    headerSubtitle: '毎日の体調・服薬・数値を記録して、医療との連携をサポート',
    badgeText: '健康管理 🌿',
    theme: COLOR_THEMES.find((t) => t.id === 'theme-healthcare') ?? COLOR_THEMES[4],
    aiPersona: {
      name: 'みちこ先生',
      role: 'かかりつけAIアドバイザー',
      tone: 'gentle',
      avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
      avatarType: 'preset',
      speechBubbleText: '🌿 今日もお身体の状態を記録してみましょう。無理せず、ゆっくりと！',
      encouragementQuotes: [
        { id: 'h1', quote: '毎日の小さな記録が、あなたの健康を守る大切なデータになります。', subtext: 'みちこ先生より', emoji: '🏥' },
        { id: 'h2', quote: '今日の体調、しっかり記録できましたね。継続は力なりです！', subtext: '応援メッセージ', emoji: '🌸' },
        { id: 'h3', quote: '記録を続けることで、自分の体のパターンが見えてきます。', subtext: 'セルフケアTips', emoji: '📊' },
      ],
    },
    dailyConfig: {
      title: '毎日の健康セルフログ',
      enableCondition: true,
      conditionLabel: '本日の体調',
      enableWeather: true,
      checkItems: [
        { id: 'meds', label: '服薬・処方薬を飲んだ', icon: '💊', defaultChecked: false },
        { id: 'water', label: '水分をしっかり摂った', icon: '💧', defaultChecked: false },
        { id: 'rest', label: '十分に休んだ', icon: '😴', defaultChecked: false },
      ],
      sliders: [
        { id: 'fatigue', label: '疲労感・だるさ', min: 0, max: 10, step: 1, unit: '', minLabel: '元気', maxLabel: 'つらい', defaultValue: 3 },
        { id: 'pain', label: 'しびれ・痛み (VAS)', min: 0, max: 10, step: 1, unit: '', minLabel: 'なし', maxLabel: '強い', defaultValue: 2 },
      ],
      numericFields: [
        { id: 'temp', label: '体温', unit: '℃', placeholder: '36.5', defaultValue: 36.5 },
        { id: 'steps', label: '歩数', unit: '歩', placeholder: '2000', defaultValue: 0 },
      ],
      energyLabel: 'エネルギー・活力レベル',
      energyIcon: '⚡',
      enableEnergy: true,
      memoLabel: '症状・気づき・通院メモ',
      memoPlaceholder: '今日の症状や気になることをメモしましょう...',
      quickTags: ['安定しています', '少し疲れ気味', '通院日', '薬を変更'],
    },
    evalConfig: {
      enabled: true,
      title: '定期コンディション評価',
      evaluatorLabel: '担当医 / 専門職 / 本人',
      metrics: [
        { id: 'overallCondition', label: '総合体調スコア', category: '評価', unit: '点', target: 10, type: 'score5' },
        { id: 'weight', label: '体重', category: '測定', unit: 'kg', type: 'number' },
      ],
      adviceLabel: '所見・医師コメント',
      goalLabel: '次回までの目標・方針',
    },
    isPublic: true,
    isActive: true,
    sortOrder: 1,
    createdAt: today,
    updatedAt: today,
  },

  // ② フィットネス・トレーニングログ
  {
    id: 'tmpl-fitness',
    name: 'フィットネス・トレーニングログ',
    description: '筋トレ・有酸素・体重管理などを記録。自分だけのパーソナルトレーナー日誌として使えます。',
    emoji: '💪',
    category: 'fitness',
    headerTitle: 'マイ トレーニングLog',
    headerSubtitle: '筋肉・体力・モチベーション、すべてを一冊に記録しよう',
    badgeText: 'FITNESS PRO 🔥',
    theme: COLOR_THEMES.find((t) => t.id === 'theme-fitness') ?? COLOR_THEMES[1],
    aiPersona: {
      name: 'FITコーチ',
      role: '専属フィットネスコーチ',
      tone: 'passionate',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      avatarType: 'preset',
      speechBubbleText: '🔥 今日も最高のトレーニングをしよう！継続こそ最強！',
      encouragementQuotes: [
        { id: 'f1', quote: '昨日の自分より、今日の自分を超えろ！', subtext: 'FITコーチより', emoji: '💪' },
        { id: 'f2', quote: 'プロテイン飲んだ？回復も立派なトレーニングだ！', subtext: '栄養アドバイス', emoji: '🥗' },
        { id: 'f3', quote: '記録を積み上げた数だけ、あなたは強くなっている！', subtext: '継続応援', emoji: '🔥' },
      ],
    },
    dailyConfig: {
      title: 'デイリートレーニング記録',
      enableCondition: true,
      conditionLabel: '本日の筋肉・体力コンディション',
      enableWeather: false,
      checkItems: [
        { id: 'training', label: 'メイントレーニング実施', icon: '🏋️', defaultChecked: false },
        { id: 'protein', label: 'プロテイン摂取', icon: '🥤', defaultChecked: false },
        { id: 'stretch', label: 'ストレッチ・クールダウン', icon: '🧘', defaultChecked: false },
        { id: 'water2L', label: '水分2L摂取', icon: '💧', defaultChecked: false },
      ],
      sliders: [
        { id: 'soreness', label: '筋肉痛・疲労度', min: 0, max: 5, step: 1, minLabel: '軽い', maxLabel: '強い', defaultValue: 2 },
        { id: 'motivation', label: 'やる気・モチベーション', min: 0, max: 5, step: 1, minLabel: '低め', maxLabel: '最高潮', defaultValue: 4 },
      ],
      numericFields: [
        { id: 'weight', label: '体重', unit: 'kg', placeholder: '65.0' },
        { id: 'trainingMin', label: 'トレーニング時間', unit: '分', placeholder: '60', defaultValue: 60 },
      ],
      energyLabel: 'モチベーション充実度',
      energyIcon: '🔥',
      enableEnergy: true,
      memoLabel: 'トレーニングメモ',
      memoPlaceholder: '今日のメニューや気づきをメモしましょう...',
      quickTags: ['ベンチプレスPR更新！', 'ランニング5km完走', '回復日', 'ジム休み'],
    },
    evalConfig: {
      enabled: true,
      title: '月次フィットネスチェック',
      evaluatorLabel: '担当トレーナー / 本人',
      metrics: [
        { id: 'bodyFat', label: '体脂肪率', category: '体組成', unit: '%', type: 'number' },
        { id: 'muscle', label: '筋肉量', category: '体組成', unit: 'kg', type: 'number' },
        { id: 'achieveScore', label: '目標達成スコア', category: '評価', unit: '点', target: 100, type: 'score5' },
      ],
      adviceLabel: 'コーチからのアドバイス',
      goalLabel: '来月の目標',
    },
    isPublic: true,
    isActive: true,
    sortOrder: 2,
    createdAt: today,
    updatedAt: today,
  },

  // ③ 学習・勉強ログ
  {
    id: 'tmpl-study',
    name: '学習・勉強ログ',
    description: '勉強時間・理解度・集中度を毎日記録。受験・資格取得・スキルアップをサポートします。',
    emoji: '📚',
    category: 'education',
    headerTitle: 'マイ スタディLog',
    headerSubtitle: '毎日の学習記録で目標達成を着実にサポート',
    badgeText: 'STUDY 📚 LOG',
    theme: COLOR_THEMES.find((t) => t.id === 'theme-education') ?? COLOR_THEMES[2],
    aiPersona: {
      name: '美咲先生',
      role: 'AI学習アドバイザー',
      tone: 'polite',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      avatarType: 'preset',
      speechBubbleText: '✏️ 今日の学習、記録してみましょう。コツコツが一番の近道ですよ！',
      encouragementQuotes: [
        { id: 's1', quote: '1日1ページ、1問1答の積み重ねが合格を引き寄せます！', subtext: '美咲先生より', emoji: '📖' },
        { id: 's2', quote: '集中できた時間をしっかり記録しておくと、モチベーションの源になりますよ。', subtext: '学習Tips', emoji: '⏱' },
        { id: 's3', quote: '今日の自分が頑張った証拠を、このログに刻んでください！', subtext: '継続応援', emoji: '🌟' },
      ],
    },
    dailyConfig: {
      title: 'デイリー学習ログ',
      enableCondition: true,
      conditionLabel: '本日の頭の冴え・集中度',
      enableWeather: false,
      checkItems: [
        { id: 'review', label: '前日の復習をした', icon: '🔄', defaultChecked: false },
        { id: 'goal', label: '今日のノルマ達成', icon: '✅', defaultChecked: false },
        { id: 'break', label: 'ポモドーロ休憩を取った', icon: '☕', defaultChecked: false },
      ],
      sliders: [
        { id: 'concentration', label: '集中度', min: 0, max: 5, step: 1, minLabel: '散漫', maxLabel: '超集中', defaultValue: 3 },
        { id: 'understanding', label: '理解度・手応え', min: 0, max: 5, step: 1, minLabel: '難しかった', maxLabel: 'よく理解', defaultValue: 3 },
      ],
      numericFields: [
        { id: 'studyMin', label: '学習時間', unit: '分', placeholder: '120', defaultValue: 60 },
        { id: 'problems', label: '解いた問題数', unit: '問', placeholder: '20', defaultValue: 0 },
      ],
      energyLabel: 'やる気・モチベーション',
      energyIcon: '✏️',
      enableEnergy: true,
      memoLabel: '今日の学習メモ・気づき',
      memoPlaceholder: '学習内容のメモや気づきを記録しましょう...',
      quickTags: ['模試で高得点！', '難問を克服', '少し眠かった', '新単元スタート'],
    },
    evalConfig: {
      enabled: true,
      title: '月次学習達成度チェック',
      evaluatorLabel: '担当講師 / 本人',
      metrics: [
        { id: 'totalHours', label: '月間学習時間', category: '記録', unit: '時間', type: 'number' },
        { id: 'testScore', label: '模試・テストスコア', category: '成績', unit: '点', target: 100, type: 'number' },
        { id: 'achieveRate', label: '目標達成率', category: '評価', unit: '%', target: 100, type: 'number' },
      ],
      adviceLabel: '先生からの講評・アドバイス',
      goalLabel: '来月の学習目標',
    },
    isPublic: true,
    isActive: true,
    sortOrder: 3,
    createdAt: today,
    updatedAt: today,
  },

  // ④ 推し活ログ
  {
    id: 'tmpl-oshi',
    name: '推し活・ファンライフログ',
    description: 'ライブ参加・グッズ収集・視聴記録など、推し活のすべてを日記形式で記録！',
    emoji: '💎',
    category: 'idol',
    headerTitle: 'マイ 推し活Log',
    headerSubtitle: '推しと過ごした今日という一日を、ここに記録しよう',
    badgeText: 'OSHI LIFE 💎',
    theme: COLOR_THEMES.find((t) => t.id === 'theme-idol') ?? COLOR_THEMES[0],
    aiPersona: {
      name: '推し活AIパートナー',
      role: 'ファンライフサポーター',
      tone: 'friendly',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b88c?w=400&auto=format&fit=crop&q=80',
      avatarType: 'preset',
      speechBubbleText: '💎 今日も推し活楽しんでる？一緒に記録しよう！',
      encouragementQuotes: [
        { id: 'o1', quote: '推しが元気でいてくれることが、一番の幸せ。今日も記録でエネルギーチャージ！', subtext: 'ファンライフより', emoji: '💎' },
        { id: 'o2', quote: '推し活日記は未来の自分へのプレゼント。続けるほど宝物になるよ！', subtext: '継続応援', emoji: '🌸' },
        { id: 'o3', quote: '今日の推し活エネルギーはどれくらい？記録して可視化しよう！', subtext: 'デイリーチェック', emoji: '⭐' },
      ],
    },
    dailyConfig: {
      title: '推し活デイリーログ',
      enableCondition: true,
      conditionLabel: '今日の心のコンディション',
      enableWeather: false,
      checkItems: [
        { id: 'content', label: '推しのコンテンツを見た', icon: '📱', defaultChecked: false },
        { id: 'music', label: '推しの音楽を聴いた', icon: '🎵', defaultChecked: false },
        { id: 'sns', label: 'SNS・コミュニティを確認', icon: '💬', defaultChecked: false },
        { id: 'goods', label: 'グッズ・コレクションを整理', icon: '🗂️', defaultChecked: false },
      ],
      sliders: [
        { id: 'oshiEnergy', label: '推し活エネルギー', min: 0, max: 100, step: 5, minLabel: '充電切れ', maxLabel: 'MAX充電', defaultValue: 80 },
        { id: 'happiness', label: '今日の幸せ度', min: 0, max: 5, step: 1, minLabel: 'そこそこ', maxLabel: '最高🌟', defaultValue: 4 },
      ],
      numericFields: [
        { id: 'fanSpend', label: '推し活出費', unit: '円', placeholder: '0', defaultValue: 0 },
      ],
      energyLabel: '推し活充実エネルギー',
      energyIcon: '💎',
      enableEnergy: true,
      memoLabel: '推し活日記',
      memoPlaceholder: '今日の推し活を日記に記録しよう...',
      quickTags: ['ライブ最高だった！', '新グッズ入手', '配信視聴', 'SNS更新チェック'],
    },
    evalConfig: {
      enabled: false,
      title: '推し活月次まとめ',
      evaluatorLabel: '本人',
      metrics: [
        { id: 'liveCount', label: 'ライブ参加数', category: '記録', unit: '回', type: 'number' },
        { id: 'oshiScore', label: '推し活満足スコア', category: '評価', unit: '点', target: 10, type: 'score5' },
      ],
      adviceLabel: '今月の推し活ひとことまとめ',
      goalLabel: '来月の推し活目標',
    },
    isPublic: true,
    isActive: true,
    sortOrder: 4,
    createdAt: today,
    updatedAt: today,
  },

  // ⑤ ダイエット・体重管理ログ
  {
    id: 'tmpl-diet',
    name: 'ダイエット・体重管理ログ',
    description: '食事・カロリー・体重・運動を記録して理想の体型へ。継続を可視化で後押し！',
    emoji: '⚖️',
    category: 'wellness',
    headerTitle: 'マイ ダイエットLog',
    headerSubtitle: '食事・運動・体重を記録して、理想の自分に近づこう',
    badgeText: 'DIET LOG ⚖️',
    theme: COLOR_THEMES.find((t) => t.id === 'theme-wellness') ?? COLOR_THEMES[7],
    aiPersona: {
      name: 'ウェルネスAI',
      role: '食事・体重管理アドバイザー',
      tone: 'gentle',
      avatarUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80',
      avatarType: 'preset',
      speechBubbleText: '🌿 今日の食事と体重、記録してみましょう！継続が一番の近道！',
      encouragementQuotes: [
        { id: 'd1', quote: '数字に一喜一憂しないで！トレンドを見て判断するのが成功への鍵。', subtext: 'ウェルネスAIより', emoji: '📊' },
        { id: 'd2', quote: '食事を楽しみながら記録することで、自然と意識が変わっていきます。', subtext: '食事Tips', emoji: '🥗' },
        { id: 'd3', quote: '今日もしっかり記録できました！その積み重ねが体を変えます。', subtext: '継続応援', emoji: '⚖️' },
      ],
    },
    dailyConfig: {
      title: 'ダイエットデイリーログ',
      enableCondition: true,
      conditionLabel: '今日の体調・空腹感',
      enableWeather: false,
      checkItems: [
        { id: 'breakfast', label: '朝食を食べた', icon: '🌅', defaultChecked: true },
        { id: 'exercise', label: '運動した（30分以上）', icon: '🏃', defaultChecked: false },
        { id: 'sugarControl', label: '糖質・脂質を意識した', icon: '🥗', defaultChecked: false },
        { id: 'noAlcohol', label: 'アルコールなし', icon: '🚫', defaultChecked: false },
      ],
      sliders: [
        { id: 'hunger', label: '空腹感・食欲', min: 0, max: 5, step: 1, minLabel: '食欲なし', maxLabel: '食欲旺盛', defaultValue: 3 },
        { id: 'willpower', label: '意志力・自制心', min: 0, max: 5, step: 1, minLabel: '誘惑に負けた', maxLabel: '完全コントロール', defaultValue: 3 },
      ],
      numericFields: [
        { id: 'weight', label: '体重', unit: 'kg', placeholder: '60.0' },
        { id: 'calorie', label: '摂取カロリー', unit: 'kcal', placeholder: '1500', defaultValue: 0 },
        { id: 'exerciseMin', label: '運動時間', unit: '分', placeholder: '30', defaultValue: 0 },
      ],
      energyLabel: 'ダイエット継続モチベーション',
      energyIcon: '⚖️',
      enableEnergy: true,
      memoLabel: '食事・運動メモ',
      memoPlaceholder: '今日の食事内容や運動をメモしましょう...',
      quickTags: ['目標体重達成！', '暴食した反省', '外食のためカロリー高め', '有酸素+筋トレ'],
    },
    evalConfig: {
      enabled: true,
      title: '月次ボディチェック',
      evaluatorLabel: '本人 / トレーナー',
      metrics: [
        { id: 'weightChange', label: '体重変化', category: '記録', unit: 'kg', type: 'number' },
        { id: 'bodyFat', label: '体脂肪率', category: '体組成', unit: '%', type: 'number' },
        { id: 'waist', label: 'ウエスト', category: '測定', unit: 'cm', type: 'number' },
      ],
      adviceLabel: '今月の振り返り・アドバイス',
      goalLabel: '来月の目標体重・目標',
    },
    isPublic: true,
    isActive: true,
    sortOrder: 5,
    createdAt: today,
    updatedAt: today,
  },

  // ⑥ メンタルヘルス・ウェルビーイングログ
  {
    id: 'tmpl-mental',
    name: 'メンタルヘルス・気分ログ',
    description: '気分・睡眠・ストレスを毎日記録。心の状態を可視化して、セルフケアに役立てましょう。',
    emoji: '🧘',
    category: 'wellness',
    headerTitle: 'マイ こころのLog',
    headerSubtitle: '今日の気分と心の状態を、ていねいに記録しましょう',
    badgeText: 'WELL-BEING 🌿',
    theme: COLOR_THEMES.find((t) => t.id === 'theme-community') ?? COLOR_THEMES[3],
    aiPersona: {
      name: 'こころのAI',
      role: 'メンタルウェルビーイングサポーター',
      tone: 'gentle',
      avatarUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&auto=format&fit=crop&q=80',
      avatarType: 'preset',
      speechBubbleText: '🌱 今日の気分、どうですか？ありのままをここに記録してください。',
      encouragementQuotes: [
        { id: 'm1', quote: '感情を記録することは、自分自身を理解する大切な第一歩です。', subtext: 'こころのAIより', emoji: '🌱' },
        { id: 'm2', quote: '今日の「しんどい」も記録。それが未来の自分を助けるデータになります。', subtext: 'セルフケアTips', emoji: '🌸' },
        { id: 'm3', quote: '記録を続けること自体が、あなたの心を大切にしているサインです。', subtext: '継続応援', emoji: '🧘' },
      ],
    },
    dailyConfig: {
      title: '気分・メンタルデイリーログ',
      enableCondition: true,
      conditionLabel: '今日の気分・心のコンディション',
      enableWeather: true,
      checkItems: [
        { id: 'meditation', label: '瞑想・深呼吸をした', icon: '🧘', defaultChecked: false },
        { id: 'journal', label: '感謝日記を書いた', icon: '📝', defaultChecked: false },
        { id: 'outdoor', label: '外に出た・日光を浴びた', icon: '☀️', defaultChecked: false },
        { id: 'social', label: '誰かと話せた', icon: '💬', defaultChecked: false },
      ],
      sliders: [
        { id: 'mood', label: '気分・感情スコア', min: 0, max: 10, step: 1, minLabel: '落ち込んでいる', maxLabel: '最高の気分', defaultValue: 6 },
        { id: 'stress', label: 'ストレスレベル', min: 0, max: 10, step: 1, minLabel: '穏やか', maxLabel: '強いストレス', defaultValue: 3 },
        { id: 'sleep', label: '睡眠の質', min: 0, max: 5, step: 1, minLabel: '眠れなかった', maxLabel: 'よく眠れた', defaultValue: 3 },
      ],
      numericFields: [
        { id: 'sleepHours', label: '睡眠時間', unit: '時間', placeholder: '7', defaultValue: 7 },
      ],
      energyLabel: 'こころのエネルギー充実度',
      energyIcon: '🌿',
      enableEnergy: true,
      memoLabel: '今日の気持ち・出来事メモ',
      memoPlaceholder: '今日感じたこと、あったことを自由に書いてみてください...',
      quickTags: ['穏やかな一日', '少し不安を感じた', '嬉しいことがあった', '疲れが溜まっている'],
    },
    evalConfig: {
      enabled: true,
      title: '月次メンタルチェック',
      evaluatorLabel: '本人 / カウンセラー',
      metrics: [
        { id: 'moodAvg', label: '平均気分スコア', category: '評価', unit: '点', target: 10, type: 'score5' },
        { id: 'stressAvg', label: '平均ストレスレベル', category: '評価', unit: '点', target: 10, type: 'score5' },
      ],
      adviceLabel: 'カウンセラー・専門家からのコメント',
      goalLabel: '来月の目標・取り組み',
    },
    isPublic: true,
    isActive: true,
    sortOrder: 6,
    createdAt: today,
    updatedAt: today,
  },
];

// Masterのローカル管理用: LocalStorageキー
export const PUBLIC_TEMPLATES_STORAGE_KEY = 'cheer_public_templates_v1';

export function getPublicTemplates(): PublicTemplate[] {
  try {
    const raw = localStorage.getItem(PUBLIC_TEMPLATES_STORAGE_KEY);
    if (!raw) return [...PUBLIC_TEMPLATES];
    return JSON.parse(raw) as PublicTemplate[];
  } catch {
    return [...PUBLIC_TEMPLATES];
  }
}

export function savePublicTemplates(templates: PublicTemplate[]): void {
  localStorage.setItem(PUBLIC_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
}
