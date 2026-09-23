import React, { useState } from 'react';
import { Heart, RefreshCw, FileText, Music2, Cloud, CloudCheck } from 'lucide-react';
import { HANI_QUOTES } from '../data/haniQuotes';
import type { HaniQuote } from '../types';
import { triggerSparkleConfetti } from '../utils/confetti';

interface HeaderProps {
  onOpenCaratLounge: () => void;
  onOpenMedicalReport: () => void;
  currentPslDose?: number;
  totalLogsCount: number;
  cloudStatus?: 'synced' | 'syncing' | 'offline';
  onSyncNow?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCaratLounge,
  onOpenMedicalReport,
  currentPslDose = 6,
  totalLogsCount,
  cloudStatus = 'synced',
  onSyncNow,
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showAvatarSpeech, setShowAvatarSpeech] = useState(false);

  const quote: HaniQuote = HANI_QUOTES[currentQuoteIndex % HANI_QUOTES.length];

  const handleNextQuote = () => {
    setIsRotating(true);
    triggerSparkleConfetti();
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % HANI_QUOTES.length);
      setIsRotating(false);
    }, 200);
  };

  const handleAvatarClick = () => {
    setShowAvatarSpeech(true);
    triggerSparkleConfetti();
    setTimeout(() => {
      setShowAvatarSpeech(false);
    }, 4000);
  };

  return (
    <header className="relative w-full mb-6">
      {/* Top Banner with soft gradient glow */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 relative overflow-hidden border-2 border-white/80 shadow-glass">
        {/* Decorative background blurs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#F7CAC9]/40 to-[#92A8D1]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-[#FFD1DC]/40 to-[#FFF0F5]/50 rounded-full blur-xl pointer-events-none" />

        {/* Top bar: Logo, Title & Action buttons */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Title Area */}
          <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
            {/* Jeonghan Illustrated Avatar */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick} title="タップするとジョンハンからハニへ〜！👼">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-[#F7CAC9] via-[#E8D1E6] to-[#92A8D1] shadow-md group-hover:scale-105 transition-all">
                <div className="w-full h-full rounded-xl bg-white/95 overflow-hidden relative shadow-inner">
                  <img
                    src="/jeonghan_avatar.jpg"
                    alt="Jeonghan"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1 shadow-sm">
                <Heart className="w-3 h-3 fill-white" />
              </div>

              {/* Speech bubble on tap */}
              {showAvatarSpeech && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-14 sm:-top-16 z-30 bg-slate-900/90 backdrop-blur-md text-white text-xs py-1.5 px-3 rounded-xl whitespace-nowrap shadow-xl border border-pink-300 animate-bounce">
                  ✨ ひさこさん、ハニヘ〜！👼🪽
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-sm">
                  CARAT 💎 EGPA Care
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  記録日数: <span className="font-bold text-pink-600">{totalLogsCount}日目</span>
                </span>
                {/* Cloud Sync Status */}
                {onSyncNow ? (
                  <button
                    onClick={onSyncNow}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                    title="クリックしてFirebase Firestoreと同期"
                  >
                    {cloudStatus === 'syncing' ? (
                      <>
                        <Cloud className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span className="text-amber-600">同期中...</span>
                      </>
                    ) : (
                      <>
                        <CloudCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-700">クラウド同期済</span>
                      </>
                    )}
                  </button>
                ) : null}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                <span className="svt-gradient-text">HISA-CARAT Log</span>
                <span className="text-sm font-bold text-slate-400 ml-1.5 hidden sm:inline">
                  ✨ 毎日輝くカラットダイアリー
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                ひさこのEGPAリハビリ＆セルフケア手帳（受診・定期測定共有対応）
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onOpenCaratLounge}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#F7CAC9] to-[#92A8D1] text-slate-800 text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all border border-white"
            >
              <Music2 className="w-3.5 h-3.5 text-pink-600" />
              <span>推し活ラウンジ 💎</span>
            </button>

            <button
              onClick={onOpenMedicalReport}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 text-slate-700 text-xs font-bold shadow-sm hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all border border-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>受診サマリー 🩺</span>
            </button>
          </div>
        </div>

        {/* Daily Encouragement Message Banner */}
        <div className="mt-4 pt-3.5 border-t border-pink-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-pink-50/70 via-purple-50/50 to-blue-50/60 p-3 rounded-2xl">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="text-xl sm:text-2xl mt-0.5 sm:mt-0 animate-bounce">
              {quote.emoji}
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>{quote.quote}</span>
              </div>
              <div className="text-[11px] text-pink-600 font-medium">
                {quote.subtext}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Quick Status Pill */}
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-pink-200 text-[11px] font-semibold text-slate-600 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PSL: <b className="text-pink-600">{currentPslDose}mg</b></span>
            </div>

            {/* Re-roll encouragement button */}
            <button
              onClick={handleNextQuote}
              className={`p-1.5 rounded-full bg-white text-slate-500 hover:text-pink-500 hover:shadow-sm transition-all ${
                isRotating ? 'rotate-180 transition-transform duration-300' : ''
              }`}
              title="ジョンハンからのメッセージをチェンジ！👼"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
