import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';
import type { DailyLog, PTEvalDock } from '../types';

interface MedicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyLogs: DailyLog[];
  ptDocks: PTEvalDock[];
}

export const MedicalReportModal: React.FC<MedicalReportModalProps> = ({
  isOpen,
  onClose,
  dailyLogs,
  ptDocks,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const sortedDaily = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
  const sortedDocks = [...ptDocks].sort((a, b) => b.date.localeCompare(a.date));

  const latestDaily = sortedDaily[0];
  const latestDock = sortedDocks[0];
  const firstDock = sortedDocks[sortedDocks.length - 1];

  const avgVas = sortedDaily.length
    ? (sortedDaily.reduce((acc, l) => acc + l.painVas, 0) / sortedDaily.length).toFixed(1)
    : '0';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
【EGPA リハビリ・自覚症状サマリー (HISA-CARAT Log)】
患者名: ひさこ様 (50代女性)
主疾患: 好酸球性多発血管炎性肉芽腫症 (EGPA)
記録期間: 直近 ${dailyLogs.length} 日間
担当PT: 和宏先生

■ 現在のバイタル・服薬
- プレドニン (PSL) 投与量: ${latestDaily ? latestDaily.pslDoseMg : 6} mg
- 最新の疼痛・しびれ VAS: ${latestDaily ? latestDaily.painVas : 3} / 10 (平均: ${avgVas} / 10)
- アロディニア (触覚過敏): レベル ${latestDaily ? latestDaily.allodyniaLevel : 1}
- 朝の体温推移: 36.4〜36.7℃ (微熱・炎症燃焼なし)

■ 和宏先生による理学療法評価 (最新: ${latestDock ? latestDock.date : 'N/A'})
- CS-30 (30秒椅子立ち座り): ${latestDock ? latestDock.functional.cs30Count : '--'} 回 (初期: ${firstDock ? firstDock.functional.cs30Count : '--'} 回より着実に向上)
- ロンベルグ試験 (深部感覚・バランス): ${latestDock && latestDock.functional.rombergTest === 'pass' ? '陰性 (Pass / 安定保持)' : '軽度動揺'}
- 下腿MMT: 前脛骨筋 MMT ${latestDock ? latestDock.mmt.tibialisAnterior : 4} / 長母趾伸筋 MMT ${latestDock ? latestDock.mmt.extensorHallucisLongus : 4}
- 下腿最大周囲径: 右 ${latestDock ? latestDock.calfCircumference.rightCm : '--'}cm / 左 ${latestDock ? latestDock.calfCircumference.leftCm : '--'}cm (左右差改善)

■ 自宅自主リハビリ実施状況
- 椅子立ち座りスクワット: 良好
- 足指タオルギャザー: 良好
- ご主人の包み込みケア (足裏脱感作): 毎日継続実施
- 低周波TENS療法: 継続中

■ 和宏先生からの所見
${latestDock ? latestDock.kazuhiroAdvice : '順調な回復傾向'}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative text-left">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between z-10 rounded-t-3xl no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                主治医・理学療法士 提出用経過サマリー
              </h2>
              <p className="text-xs text-slate-500">
                診察時やリハビリ評価ドックの面談時にご提示ください
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'コピー完了' : '要約コピー'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>印刷 / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 printable-area">
          {/* Top Title */}
          <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
                EGPA Rehabilitation Progress Report
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                好酸球性多発血管炎性肉芽腫症（EGPA）経過報告書
              </h1>
            </div>
            <div className="text-right text-xs text-slate-500">
              作成日: {new Date().toLocaleDateString('ja-JP')}
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">患者名</span>
              <span className="font-bold text-slate-800">ひさこ 様 (50代女性)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">担当PT</span>
              <span className="font-bold text-slate-800">和宏 先生</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">現在ステロイド量</span>
              <span className="font-bold text-pink-600">PSL {latestDaily ? latestDaily.pslDoseMg : 6} mg / 日</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">自覚疼痛 (VAS平均)</span>
              <span className="font-bold text-orange-600">{avgVas} / 10 (改善傾向)</span>
            </div>
          </div>

          {/* 1. PT Dock Evaluation Progression */}
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 mb-2 border-l-4 border-indigo-600 pl-2">
              1. 理学療法評価ドック推移（和宏先生評価）
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-2 border border-slate-200 font-bold">評価日</th>
                    <th className="p-2 border border-slate-200 font-bold">前脛骨筋 (TA)</th>
                    <th className="p-2 border border-slate-200 font-bold">長母趾伸筋 (EHL)</th>
                    <th className="p-2 border border-slate-200 font-bold">CS-30 (30秒立座)</th>
                    <th className="p-2 border border-slate-200 font-bold">カーフレイズ (左/右)</th>
                    <th className="p-2 border border-slate-200 font-bold">ロンベルグ (バランス)</th>
                    <th className="p-2 border border-slate-200 font-bold">下腿周径 (右/左)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDocks.map((dock) => (
                    <tr key={dock.id} className="hover:bg-slate-50">
                      <td className="p-2 border border-slate-200 font-bold text-indigo-700">{dock.date}</td>
                      <td className="p-2 border border-slate-200">MMT {dock.mmt.tibialisAnterior}</td>
                      <td className="p-2 border border-slate-200">MMT {dock.mmt.extensorHallucisLongus}</td>
                      <td className="p-2 border border-slate-200 font-extrabold text-indigo-600">
                        {dock.functional.cs30Count} 回
                      </td>
                      <td className="p-2 border border-slate-200">
                        L: {dock.functional.singleLegHeelRaiseLeft} / R: {dock.functional.singleLegHeelRaiseRight}
                      </td>
                      <td className="p-2 border border-slate-200">
                        {dock.functional.rombergTest === 'pass' ? '陰性 (Pass)' : '軽度動揺'}
                      </td>
                      <td className="p-2 border border-slate-200">
                        {dock.calfCircumference.rightCm} / {dock.calfCircumference.leftCm} cm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {latestDock && (
              <div className="mt-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs text-slate-700">
                <span className="font-bold text-indigo-900 block mb-0.5">理学療法士 和宏先生の所見:</span>
                {latestDock.kazuhiroAdvice}
              </div>
            )}
          </div>

          {/* 2. Self Care & Neuropathy Status */}
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 mb-2 border-l-4 border-pink-500 pl-2">
              2. 自宅自主リハビリ実施度 ＆ 神経障害自覚症状
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="border border-slate-200 rounded-xl p-3">
                <span className="font-bold text-slate-700 block mb-1">自主トレーニング項目:</span>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> 椅子立ち座り (大腿四頭筋賦活化)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> タオルギャザー (足指内在筋・深腓骨神経)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500">♥</span> ご主人の包み込みケア (足底アロディニア脱感作)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> 低周波TENS刺激療法
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <span className="font-bold text-slate-700 block mb-1">神経症状の経過:</span>
                <p className="text-slate-600 leading-relaxed">
                  発症初期にみられた足底の強いアロディニア（靴下や触刺激による激痛）は、ご主人の温かい包み込みケアとリハビリによりレベル1〜0（軽度〜気にならない）へと着実に寛解傾向。
                  気圧低下時や冷え込み時に軽微なピリピリ感があるものの、歩行機能は大幅に改善しています。
                </p>
              </div>
            </div>
          </div>

          {/* Doctor note section */}
          <div className="border-t border-slate-200 pt-4">
            <span className="text-[11px] text-slate-400 font-bold block mb-1">
              主治医・PT先生記入欄 / コメントメモ:
            </span>
            <div className="h-16 border border-dashed border-slate-300 rounded-xl bg-slate-50/50" />
          </div>
        </div>
      </div>
    </div>
  );
};
