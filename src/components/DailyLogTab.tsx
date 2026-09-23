import React, { useState } from 'react';
import { Sparkles, Heart, CheckCircle2, Calendar } from 'lucide-react';
import type { DailyCondition, DailyLog, WeatherCondition } from '../types';
import { FootSoleMap } from './FootSoleMap';
import { triggerFullCelebration, triggerSparkleConfetti } from '../utils/confetti';

interface DailyLogTabProps {
  onSaveLog: (log: DailyLog) => void;
  existingLogs: DailyLog[];
}

const CONDITIONS: { value: DailyCondition; emoji: string; label: string; desc: string; color: string }[] = [
  { value: 'great', emoji: '😄', label: '絶好調', desc: '体が軽やか！', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
  { value: 'good', emoji: '🙂', label: 'いい感じ', desc: 'リハビリ順調', color: 'bg-sky-50 border-sky-300 text-sky-800' },
  { value: 'okay', emoji: '😐', label: 'ふつう', desc: '落ち着いている', color: 'bg-amber-50 border-amber-300 text-amber-800' },
  { value: 'tired', emoji: '😫', label: '疲れ気味', desc: 'だるさ・重さあり', color: 'bg-orange-50 border-orange-300 text-orange-800' },
  { value: 'fever', emoji: '🤒', label: '微熱/不調', desc: '要安静・発熱注意', color: 'bg-rose-50 border-rose-300 text-rose-800' },
];

const WEATHERS: { value: WeatherCondition; icon: string; label: string }[] = [
  { value: 'sunny', icon: '☀️', label: '晴れ' },
  { value: 'cloudy', icon: '☁️', label: '曇り' },
  { value: 'rain', icon: '🌧️', label: '雨' },
  { value: 'low_pressure', icon: '📉', label: '低気圧注意' },
  { value: 'cold', icon: '❄️', label: '冷え込み' },
];

const QUICK_MEMO_TAGS = [
  'セブチの曲聴きながらリハビリ🎶',
  'ご主人の包み込みケアで温まった🥰',
  '足指タオルギャザー20回完了！',
  '散歩で歩数アップ🌸',
  '少し足裏ピリピリ⚡️',
  '和宏先生のアドバイス実践中👟',
];

export const DailyLogTab: React.FC<DailyLogTabProps> = ({ onSaveLog, existingLogs }) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Find if today already logged
  const todayExisting = existingLogs.find((l) => l.date === todayStr);

  const [date, setDate] = useState(todayExisting?.date || todayStr);
  const [condition, setCondition] = useState<DailyCondition>(todayExisting?.condition || 'good');
  const [fatigueLevel, setFatigueLevel] = useState<number>(todayExisting?.fatigueLevel || 2);
  const [painVas, setPainVas] = useState<number>(todayExisting?.painVas ?? 4);
  const [allodyniaLevel, setAllodyniaLevel] = useState<number>(todayExisting?.allodyniaLevel ?? 1);
  const [painLocations, setPainLocations] = useState<string[]>(
    todayExisting?.painLocations || ['足裏全体', 'つま先']
  );
  const [exercises, setExercises] = useState(
    todayExisting?.exercises || {
      chairSquats: true,
      towelGather: true,
      husbandSoleCare: true,
      tensTherapy: true,
      calfStretch: true,
      walking: false,
    }
  );
  const [pslDoseMg, setPslDoseMg] = useState<number>(todayExisting?.pslDoseMg ?? 6);
  const [bodyTemp, setBodyTemp] = useState<number | undefined>(todayExisting?.bodyTemp ?? 36.5);
  const [stepCount, setStepCount] = useState<number | undefined>(todayExisting?.stepCount ?? 3500);
  const [weather, setWeather] = useState<WeatherCondition>(todayExisting?.weather || 'sunny');
  const [oshiEnergy, setOshiEnergy] = useState<number>(todayExisting?.oshiEnergy ?? 90);
  const [memo, setMemo] = useState<string>(todayExisting?.memo || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleExercise = (key: keyof typeof exercises) => {
    const updated = { ...exercises, [key]: !exercises[key] };
    setExercises(updated);
    if (!exercises[key]) {
      triggerSparkleConfetti();
    }
  };

  const addQuickTag = (tag: string) => {
    if (!memo.includes(tag)) {
      setMemo((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      id: todayExisting ? todayExisting.id : `log-${Date.now()}`,
      date,
      condition,
      fatigueLevel,
      painVas,
      allodyniaLevel,
      painLocations,
      exercises,
      pslDoseMg,
      bodyTemp,
      stepCount,
      weather,
      oshiEnergy,
      memo,
      createdAt: todayExisting?.createdAt || new Date().toISOString(),
    };

    onSaveLog(newLog);
    triggerFullCelebration();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Helper for VAS pain color
  const getVasBadge = (val: number) => {
    if (val === 0) return { label: '0: 痛み・しびれなし 🕊️', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (val <= 2) return { label: `${val}: かすかな違和感 🟢`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 4) return { label: `${val}: 軽いジンジン感 🟡`, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val <= 6) return { label: `${val}: 気になるピリピリ・しびれ 🟠`, color: 'text-orange-700 bg-orange-50 border-orange-200' };
    if (val <= 8) return { label: `${val}: 強い痛み・歩行に影響 🔴`, color: 'text-rose-700 bg-rose-50 border-rose-200' };
    return { label: `${val}: 耐えがたい激痛 ⚠️`, color: 'text-red-900 bg-red-100 border-red-300' };
  };

  const vasBadge = getVasBadge(painVas);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Weather Row */}
        <div className="glass-card rounded-3xl p-5 border border-pink-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 rounded-2xl bg-pink-100/70 text-pink-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                記録日
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="font-bold text-slate-800 bg-white/80 border border-pink-200 rounded-xl px-3 py-1.5 text-sm focus:outline-pink-400"
                />
                {date !== todayStr && (
                  <button
                    type="button"
                    onClick={() => setDate(todayStr)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-pink-50 text-pink-600 font-bold border border-pink-200 hover:bg-pink-100"
                  >
                    今日に戻す
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Weather selector */}
          <div className="w-full md:w-auto">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 text-left md:text-right">
              お天気・気圧（神経痛の変動チェック）
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {WEATHERS.map((w) => (
                <button
                  type="button"
                  key={w.value}
                  onClick={() => setWeather(w.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                    weather === w.value
                      ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                      : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-pink-50'
                  }`}
                >
                  <span>{w.icon}</span>
                  <span>{w.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Condition & Fatigue Level */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-pink-100 text-pink-600">💖</span>
              <span>1. 今日の体調コンディション ＆ 易疲労感</span>
            </h2>
            <span className="text-xs text-pink-500 font-bold">5段階評価</span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            EGPAの体調の波を把握します。疲れた日は遠慮なくベッドで横になりましょう！
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {CONDITIONS.map((c) => {
              const isSelected = condition === c.value;
              return (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setCondition(c.value)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? `${c.color} border-2 ring-2 ring-pink-300 shadow-md scale-105`
                      : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-pink-50/50'
                  }`}
                >
                  <span className="text-3xl animate-bounce-short">{c.emoji}</span>
                  <span className="text-xs font-bold mt-1">{c.label}</span>
                  <span className="text-[10px] text-slate-400">{c.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Fatigue slider */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span>🛌</span> 易疲労感・体のだるさ度合い:
              </span>
              <span className="text-pink-600 font-extrabold">
                {fatigueLevel === 1 && '1: だるさ無し・元気！'}
                {fatigueLevel === 2 && '2: わずかに重い程度'}
                {fatigueLevel === 3 && '3: ふつうのだるさ'}
                {fatigueLevel === 4 && '4: 結構疲れている'}
                {fatigueLevel === 5 && '5: 横になっていたい'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={fatigueLevel}
              onChange={(e) => setFatigueLevel(Number(e.target.value))}
              className="vas-slider"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>1: 元気いっぱい</span>
              <span>3: ふつう</span>
              <span>5: とてもだるい</span>
            </div>
          </div>
        </div>

        {/* 2. Numbness & Pain Level (VAS 0-10) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-orange-100 text-orange-600">⚡️</span>
              <span>2. 足底のしびれ ＆ 痛みレベル (VAS 0-10)</span>
            </h2>
            <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${vasBadge.color}`}>
              {vasBadge.label}
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            足裏のピリピリ感、砂利を踏んでいるような違和感、ジンジンする痛みの強さを示してください。
          </p>

          <div className="bg-white/80 p-4 rounded-2xl border border-pink-100 mb-4">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={painVas}
              onChange={(e) => setPainVas(Number(e.target.value))}
              className="vas-slider"
            />
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2">
              <span>0 (無痛)</span>
              <span>2</span>
              <span>4</span>
              <span>6</span>
              <span>8</span>
              <span>10 (激痛)</span>
            </div>
          </div>

          {/* Allodynia Selector */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>🧦</span> アロディニア（衣服やシーツが触れるだけで痛む触覚過敏）
              </span>
              <span className="text-xs font-extrabold text-purple-600">
                {allodyniaLevel === 0 && '0: なし (気にならない)'}
                {allodyniaLevel === 1 && '1: 軽度 (ピリッとする)'}
                {allodyniaLevel === 2 && '2: 中等度 (靴下や毛布が痛い)'}
                {allodyniaLevel === 3 && '3: 重度 (触れるだけで激痛)'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { lvl: 0, label: '0: なし', desc: '触れても平気' },
                { lvl: 1, label: '1: 軽度', desc: '少しピリピリ' },
                { lvl: 2, label: '2: 中等度', desc: '靴下履くとき痛む' },
                { lvl: 3, label: '3: 重度', desc: '触覚が強い痛み' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.lvl}
                  onClick={() => setAllodyniaLevel(item.lvl)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    allodyniaLevel === item.lvl
                      ? 'bg-purple-100/80 border-purple-400 text-purple-900 font-extrabold shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-purple-50/40'
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Affected Foot Zones */}
          <div className="mt-4">
            <FootSoleMap
              selectedZones={painLocations}
              onChange={(zones) => setPainLocations(zones)}
            />
          </div>
        </div>

        {/* 3. Daily Exercises & Care Completed */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-600">✨</span>
              <span>3. 本日のリハビリ ＆ ケア達成チェック</span>
            </h2>
            <span className="text-xs text-purple-600 font-bold">
              達成: {Object.values(exercises).filter(Boolean).length} / {Object.keys(exercises).length} 完了
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            タップしてチェックするとキラキラ星が舞います！できる項目を1つでも達成できたら大満点です 👼
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Chair Squats */}
            <button
              type="button"
              onClick={() => toggleExercise('chairSquats')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                exercises.chairSquats
                  ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-300 shadow-sm text-pink-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-pink-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">🪑</span>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">
                    椅子立ち座り (Chair Squats)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    太もも・大腿四頭筋の筋力強化 (目標10〜15回)
                  </div>
                </div>
              </div>
              <CheckCircle2
                className={`w-5 h-5 flex-shrink-0 ${
                  exercises.chairSquats ? 'text-pink-500 fill-pink-100' : 'text-slate-300'
                }`}
              />
            </button>

            {/* Towel Gather */}
            <button
              type="button"
              onClick={() => toggleExercise('towelGather')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                exercises.towelGather
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-sm text-purple-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-purple-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">🦶</span>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">
                    タオルギャザー (Towel Gather)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    足指でタオルをクシュクシュ手繰り寄せ (内在筋)
                  </div>
                </div>
              </div>
              <CheckCircle2
                className={`w-5 h-5 flex-shrink-0 ${
                  exercises.towelGather ? 'text-purple-500 fill-purple-100' : 'text-slate-300'
                }`}
              />
            </button>

            {/* Gentle Sole Touch by Husband */}
            <button
              type="button"
              onClick={() => toggleExercise('husbandSoleCare')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                exercises.husbandSoleCare
                  ? 'bg-gradient-to-r from-rose-50 to-amber-50 border-rose-300 shadow-sm text-rose-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-rose-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">🤲</span>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>ご主人の包み込みケア</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    温かい両手で足裏を包み込み、神経の過敏を安心へ
                  </div>
                </div>
              </div>
              <CheckCircle2
                className={`w-5 h-5 flex-shrink-0 ${
                  exercises.husbandSoleCare ? 'text-rose-500 fill-rose-100' : 'text-slate-300'
                }`}
              />
            </button>

            {/* TENS Low-frequency therapy */}
            <button
              type="button"
              onClick={() => toggleExercise('tensTherapy')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                exercises.tensTherapy
                  ? 'bg-gradient-to-r from-blue-50 to-sky-50 border-sky-300 shadow-sm text-sky-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-sky-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">⚡️</span>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">
                    低周波TENS (TENS Therapy)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    下肢・足背の神経刺激と心地よい筋緊張緩和
                  </div>
                </div>
              </div>
              <CheckCircle2
                className={`w-5 h-5 flex-shrink-0 ${
                  exercises.tensTherapy ? 'text-sky-500 fill-sky-100' : 'text-slate-300'
                }`}
              />
            </button>

            {/* Calf & Ankle Stretch */}
            <button
              type="button"
              onClick={() => toggleExercise('calfStretch')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                exercises.calfStretch
                  ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-300 shadow-sm text-teal-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-teal-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">🧘‍♀️</span>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">
                    足首くるくる＆ふくらはぎストレッチ
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    アキレス腱・足関節の柔軟性と血流促進
                  </div>
                </div>
              </div>
              <CheckCircle2
                className={`w-5 h-5 flex-shrink-0 ${
                  exercises.calfStretch ? 'text-teal-500 fill-teal-100' : 'text-slate-300'
                }`}
              />
            </button>

            {/* Walking */}
            <button
              type="button"
              onClick={() => toggleExercise('walking')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                exercises.walking
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-sm text-amber-900'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-amber-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">👟</span>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">
                    お散歩・室内ウォーキング
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    下垂足・つまずきに注意しながらマイペース歩行
                  </div>
                </div>
              </div>
              <CheckCircle2
                className={`w-5 h-5 flex-shrink-0 ${
                  exercises.walking ? 'text-amber-500 fill-amber-100' : 'text-slate-300'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. EGPA Vital Metrics (Proposed Features) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-teal-100 text-teal-600">🩺</span>
              <span>4. EGPA バイタル ＆ 推し活エネルギー</span>
            </h2>
            <span className="text-[11px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              主治医・PT共有用
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* PSL (Prednisolone) Dose */}
            <div className="bg-white/80 p-3.5 rounded-2xl border border-pink-100">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                💊 プレドニン投与量 (PSL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="60"
                  value={pslDoseMg}
                  onChange={(e) => setPslDoseMg(Number(e.target.value))}
                  className="w-full font-bold text-lg text-pink-600 bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-1.5 focus:outline-pink-400"
                />
                <span className="text-xs font-bold text-slate-500">mg</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                減量スケジュールと痛みの相関を追跡
              </span>
            </div>

            {/* Body Temperature */}
            <div className="bg-white/80 p-3.5 rounded-2xl border border-pink-100">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                🌡️ 朝の体温 (微熱チェック)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="34"
                  max="42"
                  value={bodyTemp ?? ''}
                  onChange={(e) => setBodyTemp(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-pink-400"
                />
                <span className="text-xs font-bold text-slate-500">℃</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                EGPA活動性や感染症の早期察知
              </span>
            </div>

            {/* Step Count */}
            <div className="bg-white/80 p-3.5 rounded-2xl border border-pink-100">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                👟 本日の歩数 (Step count)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="100"
                  min="0"
                  max="50000"
                  value={stepCount ?? ''}
                  onChange={(e) => setStepCount(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-pink-400"
                />
                <span className="text-xs font-bold text-slate-500">歩</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                活動量と疲労度の振り返り
              </span>
            </div>
          </div>

          {/* Oshi Energy / Hani Gauge */}
          <div className="bg-gradient-to-r from-pink-50/70 via-purple-50/70 to-blue-50/70 p-4 rounded-2xl border border-pink-200">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-slate-800 flex items-center gap-1.5">
                <span>👼</span> 推し活エネルギー / ハニ度ゲージ:
              </span>
              <span className="text-pink-600 text-sm font-extrabold flex items-center gap-1">
                <span>{oshiEnergy}%</span>
                <span>💎✨</span>
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={oshiEnergy}
              onChange={(e) => setOshiEnergy(Number(e.target.value))}
              className="vas-slider"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>ちょっと充電中🔋</span>
              <span>セブチ聴いてワクワク💓</span>
              <span>ハニへ〜全開！👼💖</span>
            </div>
          </div>
        </div>

        {/* 5. Memo Note with Quick Tags */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-600">✍️</span>
            <span>5. 今日のひさこメモ ＆ 推し活ダイアリー</span>
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            先生に伝えたいこと、楽しかったこと、足の感覚の変化などを自由に記録しましょう。
          </p>

          {/* Quick Tag Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {QUICK_MEMO_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => addQuickTag(tag)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white border border-pink-200 text-slate-600 hover:bg-pink-100 hover:text-pink-700 transition-all"
              >
                + {tag}
              </button>
            ))}
          </div>

          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            placeholder="例: セブチのライブDVDを観ながら夫に足を包み込んでもらった。足裏のピリピリが落ち着いて気持ちよく眠れそう！"
            className="w-full bg-white/90 border border-pink-200 rounded-2xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-pink-400 shadow-inner"
          />
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4 z-10 pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F7CAC9] via-[#E8D1E6] to-[#92A8D1] text-slate-800 text-base font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 border-2 border-white"
          >
            <Sparkles className="w-5 h-5 text-pink-600 animate-spin-slow" />
            <span>今日のカラット記録を保存する ✨</span>
            <span className="text-xs bg-white/80 px-2.5 py-0.5 rounded-full font-bold text-pink-600 ml-1">
              ハニへ〜👼
            </span>
          </button>

          {savedSuccess && (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center shadow-md animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>本日の記録を大切に保存しました！今日もキラキラ頑張りましたね 👼💎</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
