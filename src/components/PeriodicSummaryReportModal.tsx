import React, { useState, useEffect } from 'react';
import { X, Printer, Copy, Check, FileText, Sparkles } from 'lucide-react';
import type { Tenant, Customer, GenericDailyLog, GenericEvalRecord } from '../types/tenant';
import type { DailyLog, PTEvalDock } from '../types';

interface PeriodicSummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  customer: Customer;
  dailyLogs: GenericDailyLog[];
  evalRecords: GenericEvalRecord[];
  // Legacy support
  legacyDailyLogs?: DailyLog[];
  legacyPtDocks?: PTEvalDock[];
}

export const PeriodicSummaryReportModal: React.FC<PeriodicSummaryReportModalProps> = ({
  isOpen,
  onClose,
  tenant,
  customer,
  dailyLogs,
  evalRecords,
  legacyPtDocks = [],
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sortedDaily = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
  const sortedEvals = [...evalRecords].sort((a, b) => b.date.localeCompare(a.date));
  const latestDaily = sortedDaily[0];
  const latestEval = sortedEvals[0];

  // Calculate average energy / completion
  const avgEnergy = sortedDaily.length
    ? Math.round(
        sortedDaily.reduce((acc, l) => acc + (l.energyLevel ?? 75), 0) / sortedDaily.length
      )
    : 80;

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Copy text summary
  const handleCopyText = () => {
    const text = `
【${tenant.headerTitle} 定期活動・目標進捗サマリー】
対象顧客: ${customer.name} 様 (${customer.nickname || ''})
所属: ${tenant.name} (${tenant.badgeText})
記録期間: 直近 ${dailyLogs.length} 日分 / 最新記録: ${latestDaily ? latestDaily.date : 'なし'}
目標: ${customer.customGoal || '継続的な習慣化と自己実現'}

■ 現在のコンディション推移
- 最新体調: ${latestDaily?.condition || '良好'}
- 平均エナジー指数: ${avgEnergy}%
- 最新メモ: ${latestDaily?.memo || '順調に継続中'}

■ 最新評価測定 (${latestEval ? latestEval.date : '未測定'}):
${
  latestEval
    ? Object.entries(latestEval.metricValues || {})
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')
    : '- 定期測定データ登録待ち'
}

■ 担当者/パートナー所見:
${latestEval?.advice || tenant.aiPersona.speechBubbleText}
次回目標: ${latestEval?.nextGoal || customer.customGoal || '次回もマイペースに前進！'}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in no-print-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 text-left relative">
        {/* Modal Top Bar (Screen only, hidden on print) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between z-20 rounded-t-3xl no-print">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl text-white shadow-xs"
              style={{ backgroundColor: tenant.theme.primaryColor }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-800">
                  {tenant.headerTitle} 定期サマリー帳票 (A4 1枚PDF出力)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                  A4 1ページ最適化済
                </span>
              </div>
              <p className="text-xs text-slate-500">
                印刷ダイアログで「PDFに保存」を選択すると、整った1枚の帳票として保管・提出できます
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'コピー完了' : 'テキスト要約'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white text-xs font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer"
              style={{
                backgroundColor: tenant.theme.primaryColor,
              }}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>帳票印刷 / PDF保存</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ----------------- PRINTABLE A4 REPORT SHEET ----------------- */}
        <div
          id="printable-summary-report"
          className="p-6 sm:p-8 bg-white text-slate-900 font-sans printable-sheet"
        >
          {/* Top Title & Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: tenant.theme.primaryColor }}
                />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  {tenant.badgeText} • PERIODIC PROGRESS & CONDITION REPORT
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {tenant.headerTitle} 定期活動・目標進捗報告書
              </h1>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <div>作成日: <span className="font-bold">{new Date().toLocaleDateString('ja-JP')}</span></div>
              <div className="text-[10px] text-slate-500">発行元: {tenant.name}</div>
            </div>
          </div>

          {/* Customer & Goal Metadata Grid */}
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">顧客名 / 呼称</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {customer.name} 様 {customer.nickname && `(${customer.nickname})`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">顧客ID / 参加日</span>
              <span className="font-mono font-bold text-slate-800">
                {customer.id} / {customer.joinedDate}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">専属担当 / AIパートナー</span>
              <span className="font-bold text-slate-800">
                {tenant.aiPersona.name} ({tenant.aiPersona.role})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">記録集計期間</span>
              <span className="font-bold text-indigo-700">直近 {dailyLogs.length} 日間</span>
            </div>

            <div className="col-span-2 sm:col-span-4 pt-1 border-t border-slate-200 flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">個別設定目標:</span>
              <span className="font-bold text-slate-800 text-[11px]">
                {customer.customGoal || `${tenant.headerTitle} での継続的な習慣化と自己実現`}
              </span>
            </div>
          </div>

          {/* 4 Summary KPI Cards */}
          <div className="mt-3.5 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-500 block">総記録日数</span>
              <span className="text-lg font-black text-slate-900">{dailyLogs.length}</span>
              <span className="text-[10px] text-slate-500 ml-0.5">日</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-500 block">平均エナジー指数</span>
              <span className="text-lg font-black text-pink-600">{avgEnergy}</span>
              <span className="text-[10px] text-pink-600 font-bold ml-0.5">%</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-500 block">直近の体調判定</span>
              <span className="text-sm font-black text-emerald-700 block mt-0.5">
                {latestDaily?.condition === 'good' ? '良好 😄' : latestDaily?.condition || '安定 ✨'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] text-slate-500 block">定期測定ステータス</span>
              <span className="text-xs font-black text-indigo-700 block mt-1">
                {latestEval ? `${latestEval.date} 済` : '順調継続中'}
              </span>
            </div>
          </div>

          {/* 2-Column Main Section: Left = Periodic Evaluations, Right = Daily Habit Checklist */}
          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Left: Periodic Evaluation Table */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>1. {tenant.evalConfig.title || '定期評価・測定記録推移'}</span>
                </h3>
                <span className="text-[10px] text-slate-400">直近の測定履歴</span>
              </div>

              {sortedEvals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-1.5">測定日</th>
                        <th className="p-1.5">評価者</th>
                        <th className="p-1.5">主要指標 / 数値</th>
                        <th className="p-1.5">次回目標</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedEvals.slice(0, 3).map((ev) => (
                        <tr key={ev.id}>
                          <td className="p-1.5 font-bold text-indigo-700 whitespace-nowrap">{ev.date}</td>
                          <td className="p-1.5 whitespace-nowrap text-slate-600">{ev.evaluator}</td>
                          <td className="p-1.5 text-slate-800">
                            {Object.entries(ev.metricValues || {})
                              .slice(0, 3)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(', ')}
                          </td>
                          <td className="p-1.5 text-slate-600 truncate max-w-[120px]">{ev.nextGoal || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : legacyPtDocks.length > 0 ? (
                /* Legacy PT Dock support for Hisako's data */
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-1.5">評価日</th>
                        <th className="p-1.5">CS-30 (立座)</th>
                        <th className="p-1.5">前脛骨筋</th>
                        <th className="p-1.5">ロンベルグ</th>
                        <th className="p-1.5">下腿周径</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {legacyPtDocks.slice(0, 3).map((d) => (
                        <tr key={d.id}>
                          <td className="p-1.5 font-bold text-indigo-700">{d.date}</td>
                          <td className="p-1.5 font-extrabold text-indigo-600">{d.functional.cs30Count} 回</td>
                          <td className="p-1.5">MMT {d.mmt.tibialisAnterior}</td>
                          <td className="p-1.5">{d.functional.rombergTest === 'pass' ? '陰性(Pass)' : '軽度動揺'}</td>
                          <td className="p-1.5">{d.calfCircumference.rightCm}/{d.calfCircumference.leftCm}cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3 text-center text-[10px] text-slate-400 bg-slate-50 rounded-xl">
                  定期評価測定の記録がまだありません
                </div>
              )}
            </div>

            {/* Right: Daily Habit & Checklist Completion */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>2. 日常セルフケア＆チェック項目実施状況</span>
                </h3>
                <span className="text-[10px] text-slate-400">日々の習慣化</span>
              </div>

              <div className="space-y-1.5">
                {tenant.dailyConfig.checkItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{item.icon || '✓'}</span>
                      <span className="font-bold text-slate-800">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      継続実施中 ✨
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partner / Evaluator Comments & Free Sign-Off Box */}
          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Advice box */}
            <div className="md:col-span-8 border border-slate-200 rounded-2xl p-3 bg-white space-y-1.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. 専門職・AIパートナーからの総合所見 ＆ 励ましアドバイス</span>
                </h3>
                <span className="text-[10px] text-slate-400">{tenant.aiPersona.name}より</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 font-medium">
                {latestEval?.advice ||
                  `${customer.name}様の日々の記録とセルフケアの積み重ねが素晴らしい成果につながっています。${tenant.aiPersona.speechBubbleText} 今後も無理のないペースで、着実に目標を達成していきましょう！`}
              </p>
            </div>

            {/* Signature / Hospital / Gym Sign-off Box */}
            <div className="md:col-span-4 border border-slate-200 rounded-2xl p-3 bg-white flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  担当者・主治医 確認印 / 記入欄
                </span>
                <p className="text-[9px] text-slate-400 leading-tight">
                  面談・受診時の確認用
                </p>
              </div>
              <div className="mt-2 h-14 border border-dashed border-slate-300 rounded-xl bg-slate-50/60 flex items-center justify-center text-[10px] text-slate-400">
                (確認印 / 署名)
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400 flex items-center justify-between">
            <span>Powered by Cheer Partner SaaS • https://cheer.app</span>
            <span>Document ID: REP-{customer.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
