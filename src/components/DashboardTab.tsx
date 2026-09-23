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
  FileSpreadsheet,
  TrendingUp,
  Activity,
  Heart,
  Trash2,
  FileText,
} from 'lucide-react';
import type { DailyLog, PTEvalDock } from '../types';
import { exportDailyLogsToCsv, exportPTDocksToCsv } from '../utils/exportCsv';

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

interface DashboardTabProps {
  dailyLogs: DailyLog[];
  ptDocks: PTEvalDock[];
  onDeleteDailyLog: (id: string) => void;
  onDeletePTDock: (id: string) => void;
  onOpenMedicalReport: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  dailyLogs,
  ptDocks,
  onDeleteDailyLog,
  onDeletePTDock,
  onOpenMedicalReport,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'daily' | 'pt'>('all');

  // Sorted logs
  const sortedDaily = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const sortedDocks = [...ptDocks].sort((a, b) => a.date.localeCompare(b.date));

  // Recent stats
  const latestDaily = sortedDaily[sortedDaily.length - 1];
  const latestDock = sortedDocks[sortedDocks.length - 1];
  const prevDock = sortedDocks.length > 1 ? sortedDocks[sortedDocks.length - 2] : null;

  const avgVasThisMonth = sortedDaily.length
    ? (sortedDaily.reduce((acc, l) => acc + l.painVas, 0) / sortedDaily.length).toFixed(1)
    : '0';

  const cs30Diff = prevDock && latestDock
    ? latestDock.functional.cs30Count - prevDock.functional.cs30Count
    : 0;

  // Chart 1: PT Functional Performance (CS-30 & Heel Raise)
  const ptChartData = {
    labels: sortedDocks.map((d) => d.date.slice(5)), // MM-DD
    datasets: [
      {
        label: 'CS-30 立ち座り回数 (回)',
        data: sortedDocks.map((d) => d.functional.cs30Count),
        borderColor: '#92A8D1', // Serenity blue
        backgroundColor: 'rgba(146, 168, 209, 0.2)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#6B87B8',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: '右足カーフレイズ (回)',
        data: sortedDocks.map((d) => d.functional.singleLegHeelRaiseRight),
        borderColor: '#F7CAC9', // Rose Quartz
        backgroundColor: 'transparent',
        tension: 0.35,
        pointBackgroundColor: '#FF6B8B',
        pointRadius: 5,
      },
      {
        label: '左足カーフレイズ (回)',
        data: sortedDocks.map((d) => d.functional.singleLegHeelRaiseLeft),
        borderColor: '#E0A96D', // Gold
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
        pointBackgroundColor: '#E0A96D',
        pointRadius: 4,
      },
    ],
  };

  const ptChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'M PLUS Rounded 1c', size: 11, weight: 'bold' as const },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.85)',
        titleFont: { family: 'M PLUS Rounded 1c', size: 12 },
        bodyFont: { family: 'M PLUS Rounded 1c', size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(247, 202, 201, 0.2)' },
        ticks: { font: { family: 'M PLUS Rounded 1c', size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'M PLUS Rounded 1c', size: 10 } },
      },
    },
  };

  // Chart 2: Daily VAS Pain, Fatigue & PSL Steroid dose
  const dailyChartLabels = sortedDaily.slice(-14).map((l) => l.date.slice(5)); // last 14 logs
  const dailySlice = sortedDaily.slice(-14);

  const dailyChartData = {
    labels: dailyChartLabels,
    datasets: [
      {
        label: '足底のしびれ・痛み VAS (0-10)',
        data: dailySlice.map((l) => l.painVas),
        borderColor: '#FF7F50', // Coral
        backgroundColor: 'rgba(255, 127, 80, 0.15)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#FF7F50',
        pointRadius: 4,
      },
      {
        label: '易疲労感 (1-5)',
        data: dailySlice.map((l) => l.fatigueLevel),
        borderColor: '#B39DDB', // Lavender
        backgroundColor: 'transparent',
        tension: 0.3,
        pointBackgroundColor: '#B39DDB',
        pointRadius: 4,
      },
      {
        label: 'プレドニン量 PSL (mg)',
        data: dailySlice.map((l) => l.pslDoseMg),
        borderColor: '#4DB6AC', // Teal
        borderDash: [4, 4],
        backgroundColor: 'transparent',
        pointBackgroundColor: '#4DB6AC',
        pointRadius: 3,
      },
    ],
  };

  const dailyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'M PLUS Rounded 1c', size: 11, weight: 'bold' as const },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.85)',
        titleFont: { family: 'M PLUS Rounded 1c', size: 12 },
        bodyFont: { family: 'M PLUS Rounded 1c', size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: { color: 'rgba(146, 168, 209, 0.2)' },
        ticks: { font: { family: 'M PLUS Rounded 1c', size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'M PLUS Rounded 1c', size: 10 } },
      },
    },
  };

  // Combine items for unified timeline history
  type TimelineItem =
    | { type: 'daily'; data: DailyLog; date: string }
    | { type: 'pt'; data: PTEvalDock; date: string };

  const timelineItems: TimelineItem[] = [
    ...(filterType === 'all' || filterType === 'daily'
      ? dailyLogs.map((d) => ({ type: 'daily' as const, data: d, date: d.date }))
      : []),
    ...(filterType === 'all' || filterType === 'pt'
      ? ptDocks.map((p) => ({ type: 'pt' as const, data: p, date: p.date }))
      : []),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* CS-30 Stat */}
        <div className="glass-card rounded-3xl p-4 border border-indigo-100 shadow-sm text-left">
          <div className="flex items-center justify-between text-indigo-500 mb-1">
            <span className="text-[11px] font-bold">和宏先生 CS-30</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">
            {latestDock ? `${latestDock.functional.cs30Count}回` : '--'}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
            {cs30Diff > 0 ? `+${cs30Diff}回 向上中 🌟` : '安定維持'}
          </div>
        </div>

        {/* Avg Pain VAS */}
        <div className="glass-card rounded-3xl p-4 border border-rose-100 shadow-sm text-left">
          <div className="flex items-center justify-between text-rose-500 mb-1">
            <span className="text-[11px] font-bold">平均疼痛 (VAS)</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">
            {avgVasThisMonth} <span className="text-xs font-bold text-slate-400">/ 10</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            足裏ピリピリ感 改善傾向
          </div>
        </div>

        {/* Rehab Streak */}
        <div className="glass-card rounded-3xl p-4 border border-pink-100 shadow-sm text-left">
          <div className="flex items-center justify-between text-pink-500 mb-1">
            <span className="text-[11px] font-bold">記録日数</span>
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">
            {dailyLogs.length}日
          </div>
          <div className="text-[10px] text-pink-600 font-bold mt-0.5">
            継続は力なり！👼
          </div>
        </div>

        {/* Current Steroid */}
        <div className="glass-card rounded-3xl p-4 border border-teal-100 shadow-sm text-left">
          <div className="flex items-center justify-between text-teal-600 mb-1">
            <span className="text-[11px] font-bold">プレドニン</span>
            <span className="text-xs">💊</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-800">
            {latestDaily ? `${latestDaily.pslDoseMg}mg` : '6mg'}
          </div>
          <div className="text-[10px] text-teal-700 font-medium mt-0.5">
            順調に減量中
          </div>
        </div>
      </div>

      {/* Chart A: CS-30 & Motor Performance Trend */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-600">📈</span>
              <span>運動機能回復トレンド（和宏先生のCS-30＆カーフレイズ）</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              30秒椅子立ち座り回数と片足かかと上げの経過。下肢の抗重力筋力の着実な向上がひと目で分かります。
            </p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
            評価ドック推移
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full mt-2">
          {sortedDocks.length > 0 ? (
            <Line data={ptChartData} options={ptChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              まだPT評価ドックデータがありません
            </div>
          )}
        </div>
      </div>

      {/* Chart B: Pain VAS, Fatigue & PSL Steroid Correlation */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-100 text-rose-600">⚡️</span>
              <span>しびれ/疼痛VAS・易疲労感・ステロイド投与量の相関</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              直近の日々における足裏のしびれ度合いとだるさ、プレドニン減量状況の相関グラフです。
            </p>
          </div>
          <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
            日々の推移 (直近14日)
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full mt-2">
          {sortedDaily.length > 0 ? (
            <Line data={dailyChartData} options={dailyChartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              まだ日々の記録データがありません
            </div>
          )}
        </div>
      </div>

      {/* Data Export & Report Section */}
      <div className="glass-card rounded-3xl p-5 border border-pink-100 shadow-sm bg-gradient-to-r from-pink-50/50 via-purple-50/40 to-blue-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Download className="w-4 h-4 text-pink-600" />
            <span>データ出力 ＆ 先生提出用レポート</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Excel互換のCSVダウンロードや、診察室・リハビリ室でサッと見せられる要約を作成できます。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => exportDailyLogsToCsv(dailyLogs)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-pink-50 hover:text-pink-600 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>日常記録CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportPTDocksToCsv(ptDocks)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-purple-50 hover:text-purple-600 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
            <span>PTドックCSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenMedicalReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>提出用サマリー 🩺</span>
          </button>
        </div>
      </div>

      {/* History Log Cards */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              <span>記録タイムライン履歴</span>
            </h2>
            <p className="text-xs text-slate-500">
              日々のセルフチェックと和宏先生の評価ドックを時系列で確認できます。
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              すべて ({dailyLogs.length + ptDocks.length})
            </button>
            <button
              onClick={() => setFilterType('daily')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'daily' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              日常記録 ({dailyLogs.length})
            </button>
            <button
              onClick={() => setFilterType('pt')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'pt' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              PT評価 ({ptDocks.length})
            </button>
          </div>
        </div>

        {/* Timeline List */}
        <div className="space-y-3">
          {timelineItems.map((item) => {
            if (item.type === 'daily') {
              const log = item.data;
              const completedCount = Object.values(log.exercises).filter(Boolean).length;
              return (
                <div
                  key={log.id}
                  className="bg-white/90 rounded-2xl p-4 border border-pink-100 shadow-xs hover:border-pink-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-pink-700 bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-200">
                        {log.date}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        体調: {log.condition === 'great' ? '😄 絶好調' : log.condition === 'good' ? '🙂 良好' : log.condition === 'okay' ? '😐 ふつう' : log.condition === 'tired' ? '😫 疲れ気味' : '🤒 不調'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {log.weather === 'sunny' ? '☀️' : log.weather === 'rain' ? '🌧️' : log.weather === 'cloudy' ? '☁️' : '📉'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        VAS: {log.painVas}/10
                      </span>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                        PSL: {log.pslDoseMg}mg
                      </span>
                      <button
                        onClick={() => onDeleteDailyLog(log.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                        title="この記録を削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Exercises badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      ケア達成: {completedCount}種目
                    </span>
                    {log.exercises.husbandSoleCare && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" /> ご主人の包み込みケア済
                      </span>
                    )}
                    {log.exercises.towelGather && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        タオルギャザー済
                      </span>
                    )}
                    {log.exercises.chairSquats && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        椅子立ち座り済
                      </span>
                    )}
                    {log.stepCount && (
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {log.stepCount.toLocaleString()} 歩
                      </span>
                    )}
                  </div>

                  {log.memo && (
                    <p className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      💬 {log.memo}
                    </p>
                  )}
                </div>
              );
            } else {
              const dock = item.data;
              return (
                <div
                  key={dock.id}
                  className="bg-white/95 rounded-2xl p-4 border-2 border-purple-200 shadow-xs hover:border-purple-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-100">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-white bg-purple-600 px-2.5 py-0.5 rounded-lg shadow-xs">
                        🩺 PT評価 {dock.date}
                      </span>
                      <span className="text-xs font-bold text-purple-900">{dock.evaluator}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        CS-30: {dock.functional.cs30Count}回
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ロンベルグ: {dock.functional.rombergTest === 'pass' ? 'Pass 🌟' : '動揺'}
                      </span>
                      <button
                        onClick={() => onDeletePTDock(dock.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                        title="この評価ドックを削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
                    <b className="text-purple-800 font-bold block mb-0.5">💬 和宏先生のアドバイス:</b>
                    {dock.kazuhiroAdvice}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
