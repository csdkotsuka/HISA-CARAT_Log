import React, { useState } from 'react';
import { Heart, RefreshCw, FileText, Sparkles, Cloud, CloudCheck } from 'lucide-react';
import type { Tenant, Customer } from '../types/tenant';
import { triggerSparkleConfetti } from '../utils/confetti';
import type { AvatarStyle } from '../utils/storage';
import { getAvatarImagePath } from '../utils/streak';

interface DynamicHeaderProps {
  tenant: Tenant;
  customer: Customer;
  totalLogsCount: number;
  cloudStatus?: 'synced' | 'syncing' | 'offline';
  onSyncNow?: () => void;
  onOpenLounge: () => void;
  onOpenReport: () => void;
  activeAvatarStyle?: AvatarStyle;
  onOpenEvolutionModal?: () => void;
}

export const DynamicHeader: React.FC<DynamicHeaderProps> = ({
  tenant,
  customer,
  totalLogsCount,
  cloudStatus = 'synced',
  onSyncNow,
  onOpenLounge,
  onOpenReport,
  activeAvatarStyle = 'photo',
  onOpenEvolutionModal,
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showAvatarSpeech, setShowAvatarSpeech] = useState(false);

  const quotes = tenant.aiPersona.encouragementQuotes || [];
  const quote = quotes[currentQuoteIndex % Math.max(1, quotes.length)] || {
    quote: '今日も一歩ずつ前進！',
    subtext: `${tenant.aiPersona.name}より`,
    emoji: '✨',
  };

  const handleNextQuote = () => {
    setIsRotating(true);
    triggerSparkleConfetti();
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      setIsRotating(false);
    }, 200);
  };

  const handleAvatarClick = () => {
    setShowAvatarSpeech(true);
    triggerSparkleConfetti();
    setTimeout(() => {
      setShowAvatarSpeech(false);
    }, 4500);
  };

  // Determine avatar image source
  let avatarSrc = tenant.aiPersona.avatarUrl;
  if (tenant.id === 'tenant-carat-hisa') {
    avatarSrc = getAvatarImagePath(activeAvatarStyle);
  }

  return (
    <header className="relative w-full mb-6">
      {/* Top Banner */}
      {/* Top Banner */}
      <div
        className="glass-card rounded-3xl p-4 sm:p-6 relative border-2 shadow-glass"
        style={{
          borderColor: `${tenant.theme.primaryColor}50`,
          boxShadow: `0 8px 32px 0 ${tenant.theme.primaryColor}30`,
        }}
      >
        {/* Decorative background blurs with theme colors (contained in inner overflow-hidden wrapper so speech bubbles are never clipped) */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div
            className="absolute -top-12 -right-12 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{ background: tenant.theme.primaryColor }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-2xl pointer-events-none opacity-30"
            style={{ background: tenant.theme.secondaryColor }}
          />
        </div>

        {/* Top bar: Avatar, Title & Action buttons */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Avatar & Title Area */}
          <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
            {/* Dynamic Avatar Container */}
            <div
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
              title={`タップすると${tenant.aiPersona.name}からメッセージ！`}
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 shadow-md group-hover:scale-105 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.secondaryColor})`,
                }}
              >
                <div className="w-full h-full rounded-xl bg-white/95 overflow-hidden relative shadow-inner">
                  <img
                    src={avatarSrc}
                    alt={tenant.aiPersona.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/jeonghan_dot.jpg';
                    }}
                  />
                </div>
              </div>

              {/* Evolution badge or Persona badge */}
              {tenant.id === 'tenant-carat-hisa' && onOpenEvolutionModal ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEvolutionModal();
                  }}
                  className="absolute -top-2 -left-2 px-1.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] font-extrabold shadow-sm border border-pink-300 flex items-center gap-0.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="アバター進化ルームを開く"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  <span>
                    {activeAvatarStyle === 'photo' ? 'Lv.3 📸' : activeAvatarStyle === 'illust' ? 'Lv.2 🎨' : 'Lv.1 👾'}
                  </span>
                </button>
              ) : (
                <div className="absolute -top-2 -left-2 px-1.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] font-extrabold shadow-sm border border-white/40 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  <span>AI {tenant.aiPersona.role.slice(0, 4)}</span>
                </div>
              )}

              <div
                className="absolute -bottom-1 -right-1 text-white rounded-full p-1 shadow-sm"
                style={{ backgroundColor: tenant.theme.accentColor || tenant.theme.primaryColor }}
              >
                <Heart className="w-3 h-3 fill-white" />
              </div>

              {/* Speech bubble on tap (Fully visible and elevated above header) */}
              {showAvatarSpeech && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-14 sm:-top-16 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold py-2.5 px-4 rounded-2xl whitespace-nowrap shadow-2xl border border-white/20 animate-fade-in pointer-events-none">
                  {tenant.aiPersona.speechBubbleText
                    .replace('ひさこさん', customer.nickname || customer.name || 'あなた')
                    .replace('あおいさん', customer.nickname || customer.name || 'あなた')}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2.5 h-2.5 bg-slate-900 rotate-45" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm"
                  style={{
                    background: `linear-gradient(90deg, ${tenant.theme.primaryColor}, ${tenant.theme.secondaryColor})`,
                  }}
                >
                  {tenant.badgeText}
                </span>

                <span className="text-xs text-slate-500 font-medium">
                  {customer.nickname || customer.name} さんの記録: <span className="font-bold" style={{ color: tenant.theme.accentColor }}>{totalLogsCount}日目</span>
                </span>

                {/* Cloud Sync Status */}
                {onSyncNow ? (
                  <button
                    onClick={onSyncNow}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 border border-slate-200 text-slate-600 hover:border-slate-300 transition-colors"
                    title="同期ステータス"
                  >
                    {cloudStatus === 'syncing' ? (
                      <>
                        <Cloud className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span className="text-amber-600">同期中...</span>
                      </>
                    ) : (
                      <>
                        <CloudCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-700">クラウド連携中</span>
                      </>
                    )}
                  </button>
                ) : null}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                <span
                  style={{
                    background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {tenant.headerTitle}
                </span>
                <span className="text-sm font-bold text-slate-400 ml-1.5 hidden sm:inline">
                  ✨ 毎日のパートナーダイアリー
                </span>
              </h1>

              <p className="text-xs text-slate-500 mt-0.5">
                {tenant.headerSubtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onOpenLounge}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl text-slate-800 text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all border border-white"
              style={{
                background: `linear-gradient(135deg, ${tenant.theme.primaryColor}40, ${tenant.theme.secondaryColor}40)`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: tenant.theme.accentColor }} />
              <span>{tenant.industry === 'idol' ? '推し活ラウンジ 💎' : 'エナジーラウンジ ☕'}</span>
            </button>

            <button
              onClick={onOpenReport}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 text-slate-700 text-xs font-bold shadow-sm hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all border border-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>{tenant.industry === 'healthcare' || tenant.industry === 'idol' ? '受診サマリー 🩺' : '定期サマリー 📊'}</span>
            </button>
          </div>
        </div>

        {/* Daily Encouragement Message Banner */}
        <div
          className="mt-4 pt-3.5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl"
          style={{
            borderColor: `${tenant.theme.primaryColor}30`,
            background: `linear-gradient(90deg, ${tenant.theme.primaryColor}15, ${tenant.theme.secondaryColor}15)`,
          }}
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="text-xl sm:text-2xl mt-0.5 sm:mt-0 animate-bounce">
              {quote.emoji || '✨'}
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>{quote.quote}</span>
              </div>
              <div className="text-[11px] font-medium" style={{ color: tenant.theme.accentColor }}>
                {quote.subtext}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Quick Status Pill */}
            <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>パートナー: <b style={{ color: tenant.theme.accentColor }}>{tenant.aiPersona.name}</b></span>
            </div>

            {/* Re-roll encouragement button */}
            <button
              onClick={handleNextQuote}
              className={`p-1.5 rounded-full bg-white text-slate-500 hover:shadow-sm transition-all ${
                isRotating ? 'rotate-180 transition-transform duration-300' : ''
              }`}
              title={`${tenant.aiPersona.name}からのメッセージをチェンジ！`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
