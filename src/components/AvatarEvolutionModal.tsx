import React, { useEffect } from 'react';
import { X, Lock, CheckCircle2, Flame, Trophy } from 'lucide-react';
import type { AvatarStyle } from '../utils/storage';
import type { StreakInfo } from '../utils/streak';
import { triggerFullCelebration } from '../utils/confetti';

interface AvatarEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakInfo: StreakInfo;
  onSelectAvatar: (style: AvatarStyle) => void;
}

const STAGES: {
  id: AvatarStyle;
  level: number;
  title: string;
  desc: string;
  img: string;
  condition: string;
}[] = [
  {
    id: 'dot',
    level: 1,
    title: 'ぽこぽこドット絵ハニ 👾',
    desc: 'レトロ可愛いピクセルアート。天使の羽つき！',
    img: '/jeonghan_dot.jpg',
    condition: '初期アンロック',
  },
  {
    id: 'illust',
    level: 2,
    title: 'やわらか水彩イラスト 🎨',
    desc: 'セブチカラーの優しい光彩に包まれたイラスト。',
    img: '/jeonghan_avatar.jpg',
    condition: '3日連続達成でアンロック 🌸',
  },
  {
    id: 'photo',
    level: 3,
    title: 'リアル写真ハニ完全体 📸💎',
    desc: '本物の美しさ！笑顔あふれるジョンハン写真。',
    img: '/jeonghan_photo.jpg',
    condition: '7日連続（または週5日）達成でアンロック ✨',
  },
];

export const AvatarEvolutionModal: React.FC<AvatarEvolutionModalProps> = ({
  isOpen,
  onClose,
  streakInfo,
  onSelectAvatar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSelect = (style: AvatarStyle) => {
    if (streakInfo.unlockedStyles.includes(style)) {
      onSelectAvatar(style);
      triggerFullCelebration();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-pink-100 relative text-left">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-400 text-white flex items-center justify-center text-xl shadow-sm">
              👼
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-500">
                JEONGHAN EVOLUTION 🪽
              </span>
              <h2 className="text-base font-extrabold text-slate-800">
                ハニ進化ルーム ＆ 推し活ストリーク
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Streak Status Banner */}
          <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 p-4 rounded-2xl border border-pink-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-orange-100 text-orange-600 rounded-xl">
                  <Flame className="w-4 h-4 fill-orange-500" />
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-600 block">現在のセルフケア連続記録</span>
                  <span className="text-lg font-black text-slate-800">
                    {streakInfo.currentStreak} 日連続 達成中！🔥
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-pink-600 bg-white/80 px-2 py-0.5 rounded-full border border-pink-200">
                  {streakInfo.badgeLabel}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-1 mb-2 font-medium">
              💬 ジョンハン: 「{streakInfo.cheerMessage}」
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${streakInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0日 (ドット絵)</span>
              <span>3日 (水彩イラスト)</span>
              <span>7日 (リアル写真📸)</span>
            </div>
          </div>

          {/* 3 Avatar Evolution Stages */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>解放されたアバターを選択できます（タップで適用）</span>
            </h3>

            <div className="space-y-3">
              {STAGES.map((stage) => {
                const isUnlocked = streakInfo.unlockedStyles.includes(stage.id);
                const isSelected = streakInfo.activeStyle === stage.id;

                return (
                  <button
                    type="button"
                    key={stage.id}
                    disabled={!isUnlocked}
                    onClick={() => handleSelect(stage.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-400 shadow-md ring-2 ring-pink-200'
                        : isUnlocked
                        ? 'bg-white border-slate-200 hover:border-pink-300 hover:bg-pink-50/20'
                        : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                        <img
                          src={stage.img}
                          alt={stage.title}
                          className={`w-full h-full object-cover object-center ${
                            !isUnlocked ? 'filter grayscale brightness-75' : ''
                          }`}
                        />
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">
                            {stage.title}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-extrabold text-pink-600 bg-pink-100 px-2 py-0.2 rounded-full">
                              使用中
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                          {stage.desc}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                          条件: {stage.condition}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6 text-pink-500 fill-pink-100" />
                      ) : isUnlocked ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 hover:bg-pink-100 hover:text-pink-600">
                          変更
                        </span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="p-4 bg-slate-50 border-t border-pink-100 rounded-b-3xl text-center">
          <p className="text-xs text-slate-500">
            日々のケアを無理なく続けて、本物のジョンハンに会いに行こうね 👼💎
          </p>
        </div>
      </div>
    </div>
  );
};
