import React, { useState } from 'react';
import {
  CheckCircle2,
  Award,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Tenant, Customer, GenericEvalRecord } from '../types/tenant';
import { triggerFullCelebration } from '../utils/confetti';

interface DynamicPeriodicEvalTabProps {
  tenant: Tenant;
  customer: Customer;
  records: GenericEvalRecord[];
  onSaveRecord: (record: GenericEvalRecord) => void;
}

export const DynamicPeriodicEvalTab: React.FC<DynamicPeriodicEvalTabProps> = ({
  tenant,
  customer,
  records,
  onSaveRecord,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const latestRecord = records[records.length - 1];

  const [date, setDate] = useState(todayStr);
  const [evaluator, setEvaluator] = useState(
    latestRecord?.evaluator || `${tenant.aiPersona.name} / ${tenant.evalConfig.evaluatorLabel}`
  );

  // Dynamic Metric values
  const [metricValues, setMetricValues] = useState<Record<string, any>>(() => {
    if (latestRecord?.metricValues) return latestRecord.metricValues;
    const initial: Record<string, any> = {};
    tenant.evalConfig.metrics.forEach((m) => {
      initial[m.id] = m.target ?? 10;
    });
    return initial;
  });

  const [advice, setAdvice] = useState(
    latestRecord?.advice ||
      '着実に成果と継続の習慣が身についています。次月も目標に向かって一緒に頑張りましょう！'
  );
  const [nextGoal, setNextGoal] = useState(
    latestRecord?.nextGoal || customer.customGoal || 'さらなるステップアップを目指す！'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: GenericEvalRecord = {
      id: `eval-${Date.now()}`,
      customerId: customer.id,
      tenantId: tenant.id,
      date,
      evaluator,
      metricValues,
      advice,
      nextGoal,
      createdAt: new Date().toISOString(),
    };

    onSaveRecord(newRecord);
    triggerFullCelebration();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div
        className="glass-card rounded-3xl p-5 sm:p-6 border shadow-sm"
        style={{
          borderColor: `${tenant.theme.primaryColor}50`,
          background: `linear-gradient(135deg, ${tenant.theme.primaryColor}15, ${tenant.theme.secondaryColor}15)`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
            }}
          >
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white shadow-xs"
                style={{
                  background: `linear-gradient(90deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
                }}
              >
                {tenant.evalConfig.title}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                対象: {customer.nickname || customer.name} 様
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
              {tenant.evalConfig.title} シート
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {tenant.name} が設定した指標に基づき、定期的な進捗・測定値・アドバイスを記録します。
            </p>
          </div>
        </div>
      </div>

      {/* Success Notice */}
      {savedSuccess && (
        <div
          className="p-4 rounded-2xl text-white text-sm font-bold flex items-center justify-between shadow-lg animate-bounce"
          style={{
            background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>評価測定シートを保存しました！お疲れ様でした🎉</span>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                測定・評価実施日
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {tenant.evalConfig.evaluatorLabel}
              </label>
              <input
                type="text"
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* Dynamic Metrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>測定指標・スコア入力 ({tenant.evalConfig.metrics.length}項目)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tenant.evalConfig.metrics.map((m) => {
                const val = metricValues[m.id] ?? '';
                return (
                  <div key={m.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-normal">
                          {m.category}
                        </span>
                        <span>{m.label}</span>
                      </span>
                      {m.target !== undefined && (
                        <span className="text-[10px] text-indigo-600 font-mono">
                          目標: {m.target} {m.unit}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type={m.type === 'number' ? 'number' : 'text'}
                        step="any"
                        value={val}
                        onChange={(e) =>
                          setMetricValues({
                            ...metricValues,
                            [m.id]: m.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      {m.unit && (
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                          {m.unit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advice & Goal */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {tenant.evalConfig.adviceLabel}
              </label>
              <textarea
                rows={3}
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {tenant.evalConfig.goalLabel}
              </label>
              <input
                type="text"
                value={nextGoal}
                onChange={(e) => setNextGoal(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>定期評価を記録・保存する</span>
            </button>
          </div>
        </div>
      </form>

      {/* History Records */}
      {records.length > 0 && (
        <div className="glass-card rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowHistory(!showHistory)}
          >
            <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>過去の定期測定履歴 ({records.length}件)</span>
            </h3>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>

          {showHistory && (
            <div className="space-y-3 pt-2">
              {records.map((rec) => (
                <div key={rec.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">📅 {rec.date}</span>
                    <span className="text-slate-500">測定者: {rec.evaluator}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1">
                    {tenant.evalConfig.metrics.map((m) => (
                      <div key={m.id} className="bg-white p-2 rounded-xl border border-slate-100 text-[11px]">
                        <span className="text-slate-400 block">{m.label}</span>
                        <span className="font-mono font-bold text-slate-800">
                          {rec.metricValues?.[m.id] ?? '-'} {m.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                    <b className="text-indigo-600">講評: </b> {rec.advice}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
