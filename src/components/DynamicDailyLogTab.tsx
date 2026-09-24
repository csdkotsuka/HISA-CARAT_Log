import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Activity,
} from 'lucide-react';
import type { Tenant, Customer, GenericDailyLog } from '../types/tenant';
import type { DailyCondition, WeatherCondition } from '../types';
import { FootSoleMap } from './FootSoleMap';
import { triggerFullCelebration, triggerSparkleConfetti } from '../utils/confetti';

interface DynamicDailyLogTabProps {
  tenant: Tenant;
  customer: Customer;
  logs: GenericDailyLog[];
  onSaveLog: (log: GenericDailyLog) => void;
  onOpenEvolutionModal?: () => void;
}

const CONDITIONS: { value: DailyCondition; emoji: string; label: string; desc: string }[] = [
  { value: 'great', emoji: '😄', label: '絶好調', desc: '体が軽やか！' },
  { value: 'good', emoji: '🙂', label: 'いい感じ', desc: '順調・元気' },
  { value: 'okay', emoji: '😐', label: 'ふつう', desc: '落ち着いている' },
  { value: 'tired', emoji: '😫', label: '疲れ気味', desc: 'だるさ・重さあり' },
  { value: 'fever', emoji: '🤒', label: '不調/要安静', desc: '無理せず休息' },
];

const WEATHERS: { value: WeatherCondition; icon: string; label: string }[] = [
  { value: 'sunny', icon: '☀️', label: '晴れ' },
  { value: 'cloudy', icon: '☁️', label: '曇り' },
  { value: 'rain', icon: '🌧️', label: '雨' },
  { value: 'low_pressure', icon: '📉', label: '低気圧' },
  { value: 'cold', icon: '❄️', label: '冷え込み' },
];

export const DynamicDailyLogTab: React.FC<DynamicDailyLogTabProps> = ({
  tenant,
  customer,
  logs,
  onSaveLog,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [viewMode, setViewMode] = useState<'form' | 'calendar'>('form');
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => new Date());

  const todayExisting = logs.find((l) => l.date === todayStr);

  const [date, setDate] = useState(todayExisting?.date || todayStr);
  const [condition, setCondition] = useState<DailyCondition>(todayExisting?.condition || 'good');
  const [weather, setWeather] = useState<WeatherCondition>(todayExisting?.weather || 'sunny');

  // Dynamic Checkboxes
  const [checkStates, setCheckStates] = useState<Record<string, boolean>>(() => {
    if (todayExisting?.checkStates) return todayExisting.checkStates;
    const initial: Record<string, boolean> = {};
    tenant.dailyConfig.checkItems.forEach((item) => {
      initial[item.id] = item.defaultChecked ?? false;
    });
    return initial;
  });

  // Dynamic Sliders
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    if (todayExisting?.sliderValues) return todayExisting.sliderValues;
    const initial: Record<string, number> = {};
    tenant.dailyConfig.sliders.forEach((s) => {
      initial[s.id] = s.defaultValue;
    });
    return initial;
  });

  // Dynamic Numeric
  const [numericValues, setNumericValues] = useState<Record<string, number>>(() => {
    if (todayExisting?.numericValues) return todayExisting.numericValues;
    const initial: Record<string, number> = {};
    tenant.dailyConfig.numericFields.forEach((nf) => {
      initial[nf.id] = nf.defaultValue ?? 0;
    });
    return initial;
  });

  const [energyLevel, setEnergyLevel] = useState<number>(todayExisting?.energyLevel ?? 85);
  const [memo, setMemo] = useState<string>(todayExisting?.memo || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [caratFootZones, setCaratFootZones] = useState<string[]>([]);

  // Switch date from calendar
  const handleSelectDateFromCalendar = (targetDateStr: string) => {
    const existing = logs.find((l) => l.date === targetDateStr);
    setDate(targetDateStr);
    if (existing) {
      if (existing.condition) setCondition(existing.condition);
      if (existing.weather) setWeather(existing.weather);
      setCheckStates(existing.checkStates || {});
      setSliderValues(existing.sliderValues || {});
      setNumericValues(existing.numericValues || {});
      setEnergyLevel(existing.energyLevel ?? 85);
      setMemo(existing.memo || '');
    } else {
      const resetChecks: Record<string, boolean> = {};
      tenant.dailyConfig.checkItems.forEach((item) => {
        resetChecks[item.id] = false;
      });
      setCheckStates(resetChecks);
      setMemo('');
    }
    setViewMode('form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: GenericDailyLog = {
      id: todayExisting?.id || `log-${date}-${Date.now()}`,
      customerId: customer.id,
      tenantId: tenant.id,
      date,
      condition,
      weather,
      checkStates,
      sliderValues,
      numericValues,
      energyLevel,
      memo,
      createdAt: todayExisting?.createdAt || new Date().toISOString(),
    };

    onSaveLog(newLog);
    triggerFullCelebration();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const isCarat = tenant.id === 'tenant-carat-hisa';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* View Switcher Pill */}
      <div className="flex items-center justify-between bg-white/90 p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode('form')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'form'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>記録入力フォーム</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>記録カレンダー ({logs.length}日分)</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 pr-2 flex items-center gap-1">
          <span>{customer.nickname || customer.name} 専用ノート</span>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {savedSuccess && (
        <div
          className="p-4 rounded-2xl text-white text-sm font-bold flex items-center justify-between shadow-lg animate-bounce"
          style={{
            background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{date} の記録を保存しました！素晴らしい継続力です✨</span>
          </div>
        </div>
      )}

      {/* FORM MODE */}
      {viewMode === 'form' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Date, Condition & Weather */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleSelectDateFromCalendar(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2"
                />
              </div>

              {tenant.dailyConfig.enableWeather && (
                <div className="flex items-center gap-1 overflow-x-auto">
                  {WEATHERS.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => setWeather(w.value)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                        weather === w.value
                          ? 'bg-slate-900 text-white font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{w.icon}</span>
                      <span>{w.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Condition 5-scale */}
            {tenant.dailyConfig.enableCondition && (
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700">
                  {tenant.dailyConfig.conditionLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CONDITIONS.map((cond) => {
                    const isSelected = condition === cond.value;
                    return (
                      <button
                        key={cond.value}
                        type="button"
                        onClick={() => {
                          setCondition(cond.value);
                          triggerSparkleConfetti();
                        }}
                        className={`p-2.5 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 shadow-sm scale-[1.02]'
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{cond.emoji}</div>
                        <div className="text-xs font-bold text-slate-800">{cond.label}</div>
                        <div className="text-[10px] text-slate-400">{cond.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Routine Checklists */}
          {tenant.dailyConfig.checkItems.length > 0 && (
            <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>日々のチェック項目 ({tenant.dailyConfig.checkItems.length}項目)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tenant.dailyConfig.checkItems.map((item) => {
                  const isChecked = !!checkStates[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCheckStates({
                          ...checkStates,
                          [item.id]: !isChecked,
                        });
                        if (!isChecked) triggerSparkleConfetti();
                      }}
                      className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                          isChecked
                            ? 'bg-emerald-500 text-white'
                            : 'border border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                      <span className="text-base">{item.icon || '✅'}</span>
                      <span className={`text-xs font-bold ${isChecked ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Carat Foot Sole Map if Carat Tenant */}
          {isCarat && (
            <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-pink-200 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-pink-700 flex items-center gap-2">
                <span>🦶</span>
                <span>足裏・下肢アロディニア＆しびれマップ (HISA-CARAT特有ケア)</span>
              </h3>
              <FootSoleMap
                selectedZones={caratFootZones}
                onChange={setCaratFootZones}
              />
            </div>
          )}

          {/* Section 3: Sliders (Fatigue, VAS, Focus, etc.) */}
          {tenant.dailyConfig.sliders.length > 0 && (
            <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <span>コンディション・度合いチェック</span>
              </h3>

              <div className="space-y-4">
                {tenant.dailyConfig.sliders.map((s) => {
                  const val = sliderValues[s.id] ?? s.defaultValue;
                  return (
                    <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>{s.label}</span>
                        <span className="text-sm px-2 py-0.5 rounded-full bg-white border font-mono font-extrabold text-indigo-600">
                          {val} {s.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={val}
                        onChange={(e) =>
                          setSliderValues({
                            ...sliderValues,
                            [s.id]: Number(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>{s.minLabel || `${s.min}`}</span>
                        <span>{s.maxLabel || `${s.max}`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Numeric Inputs (Weight, Temperature, Steps, Hours) */}
          {tenant.dailyConfig.numericFields.length > 0 && (
            <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
                <span>🔢</span>
                <span>日々の数値測定値</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tenant.dailyConfig.numericFields.map((nf) => {
                  const val = numericValues[nf.id] ?? nf.defaultValue ?? 0;
                  return (
                    <div key={nf.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {nf.label}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="any"
                          value={val}
                          onChange={(e) =>
                            setNumericValues({
                              ...numericValues,
                              [nf.id]: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                          {nf.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 5: Energy Level Slider */}
          {tenant.dailyConfig.enableEnergy && (
            <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>{tenant.dailyConfig.energyIcon}</span>
                  <span>{tenant.dailyConfig.energyLabel}</span>
                </span>
                <span className="text-sm font-mono font-extrabold" style={{ color: tenant.theme.accentColor }}>
                  {energyLevel}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2.5 bg-gradient-to-r from-amber-200 via-pink-300 to-indigo-400 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Section 6: Memo & Quick Tags */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-2">
              <span>✍️</span>
              <span>{tenant.dailyConfig.memoLabel}</span>
            </h3>

            {/* Quick tags */}
            {tenant.dailyConfig.quickTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {tenant.dailyConfig.quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setMemo((prev) => (prev ? `${prev}\n・${tag}` : `・${tag}`));
                      triggerSparkleConfetti();
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-700 transition-all flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            )}

            <textarea
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={tenant.dailyConfig.memoPlaceholder}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white text-sm font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
              }}
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>本日の記録を保存する</span>
            </button>
          </div>
        </form>
      )}

      {/* CALENDAR MODE */}
      {viewMode === 'calendar' && (
        <div className="glass-card rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>
                {currentCalendarMonth.getFullYear()}年 {currentCalendarMonth.getMonth() + 1}月の記録状況
              </span>
            </h3>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setCurrentCalendarMonth(
                    new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1)
                  )
                }
                className="p-1.5 rounded-lg border hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentCalendarMonth(
                    new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1)
                  )
                }
                className="p-1.5 rounded-lg border hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
              <div key={d} className="font-bold text-slate-400 py-1">
                {d}
              </div>
            ))}

            {/* Days generator */}
            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentCalendarMonth.getFullYear()}-${String(
                currentCalendarMonth.getMonth() + 1
              ).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const logForDay = logs.find((l) => l.date === dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => handleSelectDateFromCalendar(dateStr)}
                  className={`cursor-pointer p-2 rounded-2xl border min-h-[64px] flex flex-col items-center justify-between transition-all ${
                    logForDay
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-xs hover:scale-105'
                      : isToday
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-600">{dayNum}</span>
                  {logForDay ? (
                    <div className="text-center">
                      <span className="text-sm">
                        {CONDITIONS.find((c) => c.value === logForDay.condition)?.emoji || '✨'}
                      </span>
                      <div className="text-[9px] font-bold text-emerald-700">記録済</div>
                    </div>
                  ) : isToday ? (
                    <span className="text-[9px] font-bold text-amber-600">今日</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
