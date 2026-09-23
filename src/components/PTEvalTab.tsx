import React, { useState } from 'react';
import { CheckCircle2, Award, Calendar, UserCheck, History } from 'lucide-react';
import type { PTEvalDock } from '../types';
import { FootSoleMap } from './FootSoleMap';
import { triggerFullCelebration } from '../utils/confetti';

interface PTEvalTabProps {
  onSaveDock: (dock: PTEvalDock) => void;
  ptDocks: PTEvalDock[];
}

const MMT_OPTIONS = [
  { val: 5, label: '5: 正常 (Normal)', desc: '強い最大抵抗に打ち勝てる' },
  { val: 4, label: '4: 良 (Good)', desc: '中等度〜強い抵抗に耐えられる' },
  { val: 3, label: '3: 可 (Fair)', desc: '重力に抗して全可動域動かせる' },
  { val: 2, label: '2: 劣 (Poor)', desc: '重力を除けば動かせる' },
  { val: 1, label: '1: 微 (Trace)', desc: '筋の収縮は触知できるが関節は動かない' },
  { val: 0, label: '0: 零 (Zero)', desc: '筋収縮が全くみられない' },
];

export const PTEvalTab: React.FC<PTEvalTabProps> = ({ onSaveDock, ptDocks }) => {
  const latestDock = ptDocks[ptDocks.length - 1];
  const todayStr = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(todayStr);
  const [evaluator, setEvaluator] = useState('和宏先生 (担当理学療法士)');
  const [mmt, setMmt] = useState({
    tibialisAnterior: latestDock ? latestDock.mmt.tibialisAnterior : 4,
    extensorHallucisLongus: latestDock ? latestDock.mmt.extensorHallucisLongus : 3,
    gastrocnemiusSoleus: latestDock ? latestDock.mmt.gastrocnemiusSoleus : 4,
    quadriceps: latestDock ? latestDock.mmt.quadriceps : 4,
  });
  const [cs30Count, setCs30Count] = useState<number>(latestDock ? latestDock.functional.cs30Count : 12);
  const [heelRaiseLeft, setHeelRaiseLeft] = useState<number>(latestDock ? latestDock.functional.singleLegHeelRaiseLeft : 4);
  const [heelRaiseRight, setHeelRaiseRight] = useState<number>(latestDock ? latestDock.functional.singleLegHeelRaiseRight : 5);
  const [rombergTest, setRombergTest] = useState<'pass' | 'mild_sway' | 'severe_sway'>(
    latestDock ? latestDock.functional.rombergTest : 'mild_sway'
  );
  const [calfRight, setCalfRight] = useState<number>(latestDock ? latestDock.calfCircumference.rightCm : 33.0);
  const [calfLeft, setCalfLeft] = useState<number>(latestDock ? latestDock.calfCircumference.leftCm : 32.5);
  const [sensoryZones, setSensoryZones] = useState<string[]>(
    latestDock ? latestDock.sensoryZones : ['toes', 'midfoot']
  );
  const [allodyniaScore, setAllodyniaScore] = useState<number>(latestDock ? latestDock.allodyniaScore : 3);
  const [kazuhiroAdvice, setKazuhiroAdvice] = useState<string>('');
  const [nextGoal, setNextGoal] = useState<string>('CS-30テストで15回以上。コンサートで足裏を気にせず楽しむ！');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDock: PTEvalDock = {
      id: `dock-${Date.now()}`,
      date,
      evaluator,
      mmt,
      functional: {
        cs30Count,
        singleLegHeelRaiseLeft: heelRaiseLeft,
        singleLegHeelRaiseRight: heelRaiseRight,
        rombergTest,
      },
      calfCircumference: {
        rightCm: calfRight,
        leftCm: calfLeft,
      },
      sensoryZones,
      allodyniaScore,
      kazuhiroAdvice: kazuhiroAdvice || '継続的なリハビリと包み込みケアにより、着実に下肢筋力と感覚回復が進んでいます。',
      nextGoal,
      createdAt: new Date().toISOString(),
    };

    onSaveDock(newDock);
    triggerFullCelebration();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Introduction Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm bg-gradient-to-r from-purple-50/70 via-pink-50/40 to-blue-50/60">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            🩺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                Periodic Physical Therapy Check
              </span>
              <span className="text-xs text-slate-500">数ヶ月に1度の専門評価</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1">
              和宏先生の評価ドック（理学療法カルテ）
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              EGPAによる末梢神経障害（腓骨神経麻痺・下垂足）の回復状況、MMT徒手筋力検査、30秒立ち座り（CS-30）、下腿周囲径、感覚障害ゾーンを専門的に記録・追跡します。
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Evaluator */}
        <div className="glass-card rounded-3xl p-5 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                評価実施日
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-bold text-slate-800 bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-sm focus:outline-purple-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                担当理学療法士
              </label>
              <input
                type="text"
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                className="font-bold text-slate-800 bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-sm focus:outline-purple-400 w-full sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* 1. MMT (徒手筋力テスト) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-600">💪</span>
              <span>1. MMT徒手筋力検査 (0〜5段階)</span>
            </h3>
            <span className="text-xs text-purple-600 font-bold">下肢主要筋群</span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            特にEGPAで障害されやすい前脛骨筋（つま先の持ち上げ）や長母趾伸筋の回復度合いを判定します。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tibialis Anterior */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    前脛骨筋 (TA - 足関節背屈)
                  </span>
                  <span className="text-[11px] text-pink-500 font-medium">
                    下垂足・つま先上がりチェック
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-purple-100 text-purple-700">
                  MMT {mmt.tibialisAnterior}
                </span>
              </div>
              <select
                value={mmt.tibialisAnterior}
                onChange={(e) => setMmt({ ...mmt, tibialisAnterior: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-purple-400"
              >
                {MMT_OPTIONS.map((opt) => (
                  <option key={opt.val} value={opt.val}>
                    {opt.label} - {opt.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Extensor Hallucis Longus */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    長母趾伸筋 (EHL - 親指の背屈)
                  </span>
                  <span className="text-[11px] text-purple-500 font-medium">
                    深腓骨神経の末梢支配チェック
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-purple-100 text-purple-700">
                  MMT {mmt.extensorHallucisLongus}
                </span>
              </div>
              <select
                value={mmt.extensorHallucisLongus}
                onChange={(e) => setMmt({ ...mmt, extensorHallucisLongus: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-purple-400"
              >
                {MMT_OPTIONS.map((opt) => (
                  <option key={opt.val} value={opt.val}>
                    {opt.label} - {opt.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Gastrocnemius / Soleus */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    下腿三頭筋 (腓腹筋・ヒラメ筋 - 底屈)
                  </span>
                  <span className="text-[11px] text-blue-500 font-medium">
                    つま先立ち・地面を蹴り出す力
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-purple-100 text-purple-700">
                  MMT {mmt.gastrocnemiusSoleus}
                </span>
              </div>
              <select
                value={mmt.gastrocnemiusSoleus}
                onChange={(e) => setMmt({ ...mmt, gastrocnemiusSoleus: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-purple-400"
              >
                {MMT_OPTIONS.map((opt) => (
                  <option key={opt.val} value={opt.val}>
                    {opt.label} - {opt.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Quadriceps */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    大腿四頭筋 (膝伸展・大腿筋)
                  </span>
                  <span className="text-[11px] text-emerald-500 font-medium">
                    立ち上がり・階段昇降の支持性
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-purple-100 text-purple-700">
                  MMT {mmt.quadriceps}
                </span>
              </div>
              <select
                value={mmt.quadriceps}
                onChange={(e) => setMmt({ ...mmt, quadriceps: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-purple-400"
              >
                {MMT_OPTIONS.map((opt) => (
                  <option key={opt.val} value={opt.val}>
                    {opt.label} - {opt.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Functional & Balance Tests */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-600">🎯</span>
              <span>2. 機能的パフォーマンステスト ＆ 平衡機能</span>
            </h3>
            <span className="text-xs text-indigo-600 font-bold">数値計測</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* CS-30 Test */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">
                  🪑 CS-30 (30秒立ち座り)
                </label>
                <span className="text-[10px] text-pink-500 font-bold">
                  50代女性目標: 15〜18回
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={cs30Count}
                  onChange={(e) => setCs30Count(Number(e.target.value))}
                  className="w-full font-extrabold text-xl text-indigo-600 bg-indigo-50/40 border border-indigo-200 rounded-xl px-3 py-1.5 focus:outline-purple-400"
                />
                <span className="text-sm font-bold text-slate-600">回</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                30秒間で椅子から完全に立ち上がった回数
              </span>
            </div>

            {/* Single Leg Heel Raise Left */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                🦵 左片足カーフレイズ (左足)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={heelRaiseLeft}
                  onChange={(e) => setHeelRaiseLeft(Number(e.target.value))}
                  className="w-full font-extrabold text-xl text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-purple-400"
                />
                <span className="text-sm font-bold text-slate-600">回</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                片足立ちでのかかと上げ回数
              </span>
            </div>

            {/* Single Leg Heel Raise Right */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                🦵 右片足カーフレイズ (右足)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={heelRaiseRight}
                  onChange={(e) => setHeelRaiseRight(Number(e.target.value))}
                  className="w-full font-extrabold text-xl text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-purple-400"
                />
                <span className="text-sm font-bold text-slate-600">回</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                左右の筋持久力のアンバランス確認
              </span>
            </div>
          </div>

          {/* Romberg Test */}
          <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>🙈</span> ロンベルグ試験 (Romberg Test - 閉眼立位バランステスト)
              </label>
              <span className="text-[11px] text-slate-400">深部感覚・前庭覚評価</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 'pass', label: '陰性 (Pass)', desc: '30秒間 安定して閉眼保持可能 🌟' },
                { val: 'mild_sway', label: '軽度動揺', desc: 'わずかに身体の揺れあり' },
                { val: 'severe_sway', label: '著名な動揺', desc: '足踏みや開眼・支持が必要' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.val}
                  onClick={() => setRombergTest(r.val as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    rombergTest === r.val
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-400 text-purple-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-purple-50/40'
                  }`}
                >
                  <div className="text-xs font-extrabold">{r.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Calf Circumference & Sensory Mapping */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-pink-100 text-pink-600">📏</span>
              <span>3. 下腿最大周囲径 ＆ アロディニア評価</span>
            </h3>
            <span className="text-xs text-pink-600 font-bold">筋萎縮・浮腫モニタリング</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                右下腿最大周径 (Right Calf)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="50"
                  value={calfRight}
                  onChange={(e) => setCalfRight(Number(e.target.value))}
                  className="w-full font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-purple-400"
                />
                <span className="text-xs font-bold text-slate-600">cm</span>
              </div>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                左下腿最大周径 (Left Calf)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="50"
                  value={calfLeft}
                  onChange={(e) => setCalfLeft(Number(e.target.value))}
                  className="w-full font-bold text-lg text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-purple-400"
                />
                <span className="text-xs font-bold text-slate-600">cm</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                左右差: {Math.abs(calfRight - calfLeft).toFixed(1)} cm
              </span>
            </div>
          </div>

          {/* Sensory Foot Map */}
          <FootSoleMap
            selectedZones={sensoryZones}
            onChange={(zones) => setSensoryZones(zones)}
          />

          {/* Allodynia Score 0-10 */}
          <div className="mt-4 bg-white/80 p-4 rounded-2xl border border-purple-100">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-slate-700">アロディニア（触刺激過敏度）客観評価 (0-10):</span>
              <span className="text-purple-600 font-extrabold">{allodyniaScore} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={allodyniaScore}
              onChange={(e) => setAllodyniaScore(Number(e.target.value))}
              className="vas-slider"
            />
          </div>
        </div>

        {/* 4. PT Advice & Next Goal */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-purple-100 text-purple-600">📝</span>
            <span>4. 和宏先生の評価コメント ＆ 次回目標</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            理学療法士からの評価所見、自主トレへのアドバイス、次回までのモチベーションを記入します。
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                和宏先生からのアドバイス・理学療法所見:
              </label>
              <textarea
                value={kazuhiroAdvice}
                onChange={(e) => setKazuhiroAdvice(e.target.value)}
                rows={3}
                placeholder="例: 前脛骨筋の収縮力がMMT4へと向上し、歩行時のつま先の引っ掛かりが明らかに改善されています。ご主人の包み込みケアを継続しつつ、立ち上がり回数を伸ばしていきましょう！"
                className="w-full bg-white border border-purple-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-purple-400 shadow-inner"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                次回までのリハビリ目標（推し活＆生活ゴール）:
              </label>
              <input
                type="text"
                value={nextGoal}
                onChange={(e) => setNextGoal(e.target.value)}
                placeholder="例: CS-30テスト17回！セブチのコンサートで2時間元気に立っていられる脚力作り💎"
                className="w-full bg-white border border-purple-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4 z-10 pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white text-base font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 border-2 border-white/60"
          >
            <Award className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>和宏先生の評価ドックを保存する 🩺</span>
          </button>

          {savedSuccess && (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center shadow-md animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>和宏先生の評価ドックを正常に登録しました！着実に回復していますね 👏✨</span>
            </div>
          )}
        </div>
      </form>

      {/* Past PT Dock History List */}
      <div className="mt-8 pt-6 border-t border-purple-100">
        <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-600" />
          <span>過去の和宏先生 評価ドック記録一覧 ({ptDocks.length}件)</span>
        </h3>

        <div className="space-y-3">
          {ptDocks.slice().reverse().map((dock) => (
            <div
              key={dock.id}
              className="bg-white/90 rounded-2xl p-4 border border-purple-100 shadow-xs hover:border-purple-300 transition-all text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                    {dock.date}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{dock.evaluator}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-extrabold">
                  <span className="text-indigo-600">CS-30: {dock.functional.cs30Count}回</span>
                  <span className="text-pink-600">カーフレイズ: L{dock.functional.singleLegHeelRaiseLeft} / R{dock.functional.singleLegHeelRaiseRight}</span>
                  <span className="text-emerald-600">
                    ロンベルグ: {dock.functional.rombergTest === 'pass' ? 'Pass 🌟' : '動揺'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
                <div>前脛骨筋: <b className="text-purple-600">MMT {dock.mmt.tibialisAnterior}</b></div>
                <div>長母趾伸筋: <b className="text-purple-600">MMT {dock.mmt.extensorHallucisLongus}</b></div>
                <div>下腿三頭筋: <b className="text-purple-600">MMT {dock.mmt.gastrocnemiusSoleus}</b></div>
                <div>大腿四頭筋: <b className="text-purple-600">MMT {dock.mmt.quadriceps}</b></div>
              </div>

              <p className="text-xs text-slate-700 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 mb-1.5 leading-relaxed">
                <b className="text-purple-700 font-bold block mb-0.5">💬 和宏先生のアドバイス:</b>
                {dock.kazuhiroAdvice}
              </p>

              <div className="text-[11px] text-pink-600 font-bold flex items-center gap-1">
                <span>🎯 次回目標:</span>
                <span>{dock.nextGoal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
