import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Download,
  Calendar,
  TrendingUp,
  FileText,
  Award,
} from 'lucide-react';
import type { Tenant, Customer, GenericDailyLog, GenericEvalRecord } from '../types/tenant';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DynamicDashboardTabProps {
  tenant: Tenant;
  customer: Customer;
  dailyLogs: GenericDailyLog[];
  evalRecords: GenericEvalRecord[];
  onOpenReport: () => void;
  // Legacy support for Hisako
  legacyDailyLogs?: any[];
  legacyPtDocks?: any[];
}

export const DynamicDashboardTab: React.FC<DynamicDashboardTabProps> = ({
  tenant,
  customer,
  dailyLogs,
  evalRecords,
  onOpenReport,
  legacyPtDocks = [],
}) => {
  // Available metrics from tenant daily configuration
  const numericDefs = tenant.dailyConfig.numericFields;
  const sliderDefs = tenant.dailyConfig.sliders;
  const evalDefs = tenant.evalConfig.metrics;

  // History sub-tab: daily logs vs eval records
  const [historySubTab, setHistorySubTab] = useState<'daily' | 'eval'>('daily');

  // Selected primary metric for Line Chart 1
  const [selectedPrimaryMetric, setSelectedPrimaryMetric] = useState<string>(() => {
    if (numericDefs.length > 0) return `num_${numericDefs[0].id}`;
    if (sliderDefs.length > 0) return `slider_${sliderDefs[0].id}`;
    return 'energy';
  });

  // Selected secondary metric for Line Chart 1
  const [selectedSecondaryMetric, setSelectedSecondaryMetric] = useState<string>(() => {
    if (numericDefs.length > 1) return `num_${numericDefs[1].id}`;
    if (sliderDefs.length > 0) return `slider_${sliderDefs[0].id}`;
    return 'none';
  });

  // Sorted logs ascending by date
  const sortedDaily = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const sortedEvals = [...evalRecords].sort((a, b) => a.date.localeCompare(b.date));

  // Helper to extract value from a generic log
  const getMetricValue = (log: GenericDailyLog, key: string): number => {
    if (key === 'energy') return log.energyLevel ?? 80;
    if (key.startsWith('num_')) {
      const fieldId = key.replace('num_', '');
      return log.numericValues?.[fieldId] ?? 0;
    }
    if (key.startsWith('slider_')) {
      const sliderId = key.replace('slider_', '');
      return log.sliderValues?.[sliderId] ?? 0;
    }
    return 0;
  };

  const getMetricLabel = (key: string): string => {
    if (key === 'energy') return `${tenant.dailyConfig.energyLabel} (%)`;
    if (key.startsWith('num_')) {
      const fieldId = key.replace('num_', '');
      const def = numericDefs.find((n) => n.id === fieldId);
      return def ? `${def.label} (${def.unit})` : fieldId;
    }
    if (key.startsWith('slider_')) {
      const sliderId = key.replace('slider_', '');
      const def = sliderDefs.find((s) => s.id === sliderId);
      return def ? `${def.label} (スコア)` : sliderId;
    }
    return '';
  };

  // Chart 1: Daily Progress Trends according to customer goals
  const chartLabels = sortedDaily.map((l) => l.date.slice(5)); // MM-DD

  const primaryDataset = {
    label: getMetricLabel(selectedPrimaryMetric),
    data: sortedDaily.map((l) => getMetricValue(l, selectedPrimaryMetric)),
    borderColor: tenant.theme.accentColor || tenant.theme.primaryColor,
    backgroundColor: `${tenant.theme.primaryColor}25`,
    tension: 0.35,
    fill: true,
    pointBackgroundColor: tenant.theme.primaryColor,
    pointRadius: 5,
    pointHoverRadius: 7,
  };

  const datasets = [primaryDataset];

  if (selectedSecondaryMetric !== 'none') {
    datasets.push({
      label: getMetricLabel(selectedSecondaryMetric),
      data: sortedDaily.map((l) => getMetricValue(l, selectedSecondaryMetric)),
      borderColor: tenant.theme.secondaryColor,
      backgroundColor: 'transparent',
      tension: 0.35,
      pointBackgroundColor: tenant.theme.secondaryColor,
      pointRadius: 4,
      pointHoverRadius: 6,
    } as any);
  }

  const dailyChartData = {
    labels: chartLabels,
    datasets,
  };

  // Chart 2: Periodic Evaluation Trends
  const evalChartLabels = sortedEvals.map((e) => e.date.slice(5));
  const evalDatasets = evalDefs.slice(0, 3).map((metric, idx) => {
    const colors = [tenant.theme.primaryColor, tenant.theme.secondaryColor, tenant.theme.accentColor];
    return {
      label: `${metric.label} (${metric.unit})`,
      data: sortedEvals.map((e) => Number(e.metricValues?.[metric.id]) || 0),
      borderColor: colors[idx % colors.length],
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 6,
      pointHoverRadius: 8,
    };
  });

  const evalChartData = {
    labels: evalChartLabels,
    datasets: evalDatasets,
  };

  // CSV Export handler
  const handleExportCsv = () => {
    if (sortedDaily.length === 0) return;
    const headers = [
      '日付',
      'コンディション',
      'お天気',
      tenant.dailyConfig.energyLabel,
      ...numericDefs.map((n) => `${n.label}(${n.unit})`),
      ...sliderDefs.map((s) => s.label),
      'メモ',
    ];

    const rows = sortedDaily.map((l) => [
      l.date,
      l.condition || '',
      l.weather || '',
      l.energyLevel ?? '',
      ...numericDefs.map((n) => l.numericValues?.[n.id] ?? ''),
      ...sliderDefs.map((s) => l.sliderValues?.[s.id] ?? ''),
      `"${(l.memo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${customer.name}_${tenant.headerTitle}_履歴.csv`;
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. Customer Goal & Focus Banner */}
      <div
        className="glass-card rounded-3xl p-5 sm:p-6 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{
          borderColor: `${tenant.theme.primaryColor}50`,
          background: `linear-gradient(135deg, ${tenant.theme.primaryColor}15, ${tenant.theme.secondaryColor}15)`,
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
            }}
          >
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                {customer.nickname || customer.name} 様の達成目標
              </span>
              <span className="text-xs text-slate-500 font-bold">
                記録日数: {sortedDaily.length}日
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">
              {customer.customGoal || `${tenant.headerTitle} を通じた継続的な自己実現！`}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all"
            title="CSV形式で記録をエクスポート"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>CSV出力</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>定期サマリー 📊</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Main Trend Chart */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: tenant.theme.accentColor }} />
              <span>日々の記録トレンド推移</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              あなたが求める目標に合わせて、グラフに表示する項目を自由に切り替えられます。
            </p>
          </div>

          {/* Metric Selector Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500">主軸:</span>
              <select
                value={selectedPrimaryMetric}
                onChange={(e) => setSelectedPrimaryMetric(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 cursor-pointer"
              >
                {tenant.dailyConfig.enableEnergy && (
                  <option value="energy">{tenant.dailyConfig.energyLabel}</option>
                )}
                {numericDefs.map((n) => (
                  <option key={n.id} value={`num_${n.id}`}>
                    {n.label} ({n.unit})
                  </option>
                ))}
                {sliderDefs.map((s) => (
                  <option key={s.id} value={`slider_${s.id}`}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500">副軸:</span>
              <select
                value={selectedSecondaryMetric}
                onChange={(e) => setSelectedSecondaryMetric(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 cursor-pointer"
              >
                <option value="none">なし</option>
                {tenant.dailyConfig.enableEnergy && (
                  <option value="energy">{tenant.dailyConfig.energyLabel}</option>
                )}
                {numericDefs.map((n) => (
                  <option key={n.id} value={`num_${n.id}`}>
                    {n.label} ({n.unit})
                  </option>
                ))}
                {sliderDefs.map((s) => (
                  <option key={s.id} value={`slider_${s.id}`}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {sortedDaily.length > 0 ? (
          <div className="h-64 sm:h-72 w-full">
            <Line
              data={dailyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.04)' },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            記録がまだありません。毎日の記録を入力すると自動でグラフが生成されます。
          </div>
        )}
      </div>

      {/* 3. Periodic Evaluation Chart */}
      {sortedEvals.length > 0 && (
        <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{tenant.evalConfig.title} の推移トレンド</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                定期測定ごとの各指標（{evalDefs.map((m) => m.label).join(', ')}）の向上度合いです。
              </p>
            </div>
          </div>

          <div className="h-60 sm:h-64 w-full">
            <Line
              data={evalChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } },
                  },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* 4. Dynamic History Table (Daily Logs & Periodic Evaluations) */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setHistorySubTab('daily')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  historySubTab === 'daily'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📅 日々の記録一覧 ({sortedDaily.length}件)
              </button>
              <button
                type="button"
                onClick={() => setHistorySubTab('eval')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  historySubTab === 'eval'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🏆 定期評価・測定履歴 ({sortedEvals.length > 0 ? sortedEvals.length : legacyPtDocks.length}件)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60">
            💡 過去記録の修正・更新は「Pro Partner (事業者)」画面で行えます
          </div>
        </div>

        {/* TAB 1: Daily Logs Table */}
        {historySubTab === 'daily' && (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-96">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 z-10">
                <tr>
                  <th className="py-2.5 px-3">日付</th>
                  {tenant.dailyConfig.enableCondition && <th className="py-2.5 px-3 text-center">体調 (5段階)</th>}
                  {tenant.dailyConfig.enableEnergy && (
                    <th className="py-2.5 px-3 text-center">{tenant.dailyConfig.energyLabel}</th>
                  )}
                  {numericDefs.map((n) => (
                    <th key={n.id} className="py-2.5 px-3 text-right">
                      {n.label} ({n.unit})
                    </th>
                  ))}
                  {sliderDefs.map((s) => (
                    <th key={s.id} className="py-2.5 px-3 text-center">
                      {s.label}
                    </th>
                  ))}
                  <th className="py-2.5 px-3">メモ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sortedDaily.length > 0 ? (
                  sortedDaily.slice().reverse().map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {l.date}
                      </td>
                      {tenant.dailyConfig.enableCondition && (
                        <td className="py-2.5 px-3 text-center text-sm">
                          {l.condition === 'great'
                            ? '😄 絶好調'
                            : l.condition === 'good'
                            ? '🙂 良好'
                            : l.condition === 'okay'
                            ? '😐 普通'
                            : l.condition === 'tired'
                            ? '😫 倦怠感'
                            : '🤒 微熱'}
                        </td>
                      )}
                      {tenant.dailyConfig.enableEnergy && (
                        <td className="py-2.5 px-3 text-center font-bold font-mono" style={{ color: tenant.theme.accentColor }}>
                          {l.energyLevel ?? 80}%
                        </td>
                      )}
                      {numericDefs.map((n) => (
                        <td key={n.id} className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                          {l.numericValues?.[n.id] ?? '-'}
                        </td>
                      ))}
                      {sliderDefs.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 text-center font-mono text-slate-600">
                          {l.sliderValues?.[s.id] ?? '-'}
                        </td>
                      ))}
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                        {l.memo || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                      まだ日々の記録がありません。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Periodic Evaluations Table */}
        {historySubTab === 'eval' && (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-96">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 z-10">
                <tr>
                  <th className="py-2.5 px-3">測定日</th>
                  <th className="py-2.5 px-3">測定者 / 評価者</th>
                  <th className="py-2.5 px-3">測定項目・スコア数値</th>
                  <th className="py-2.5 px-3">{tenant.evalConfig.adviceLabel || 'アドバイス・所見'}</th>
                  <th className="py-2.5 px-3">{tenant.evalConfig.goalLabel || '次回目標'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sortedEvals.length > 0 ? (
                  sortedEvals.slice().reverse().map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                        {ev.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                        {ev.evaluator || '専任スタッフ'}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
                          {evalDefs.map((def) => {
                            const val = ev.metricValues?.[def.id];
                            if (val === undefined || val === null || val === '') return null;
                            return (
                              <span
                                key={def.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200/60 text-[10px] text-indigo-900 font-bold"
                              >
                                <span>{def.label}:</span>
                                <span className="font-mono text-indigo-700">{val} {def.unit}</span>
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs">
                        <div className="line-clamp-2 text-xs">{ev.advice || '-'}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-700 max-w-xs">
                        <div className="line-clamp-2 text-xs">{ev.nextGoal || '-'}</div>
                      </td>
                    </tr>
                  ))
                ) : legacyPtDocks.length > 0 ? (
                  /* Legacy PT Docks fallback for Hisako */
                  legacyPtDocks.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                        {d.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                        {d.evaluator}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <div className="flex flex-wrap gap-1.5 max-w-sm text-[10px]">
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold">
                            CS-30: <strong className="font-mono">{d.functional.cs30Count}回</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold">
                            MMT: <strong className="font-mono">{d.mmt.tibialisAnterior}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold">
                            ロンベルグ: {d.functional.rombergTest === 'pass' ? '陰性' : '動揺'}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold">
                            下腿周囲: 右{d.calfCircumference.rightCm} / 左{d.calfCircumference.leftCm}cm
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs">
                        <div className="line-clamp-2 text-xs">{d.kazuhiroAdvice || '-'}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-700 max-w-xs">
                        <div className="line-clamp-2 text-xs">{d.nextGoal || '-'}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      定期測定・評価の履歴がまだ登録されていません。Pro Partner画面から測定記録を入力できます。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
