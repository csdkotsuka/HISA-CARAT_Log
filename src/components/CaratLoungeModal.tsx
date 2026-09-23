import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, Music, Play, Globe, PartyPopper } from 'lucide-react';
import { HANI_QUOTES } from '../data/haniQuotes';
import { triggerFullCelebration, triggerSparkleConfetti } from '../utils/confetti';
import type { ConcertGoal } from '../utils/storage';

interface CaratLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  concertGoal: ConcertGoal;
  onSaveConcertGoal: (goal: ConcertGoal) => void;
}

const FAN_LINKS = [
  {
    title: 'Weverse SEVENTEEN',
    desc: 'ジョンハンの投稿やモーメントを直接チェック！',
    url: 'https://weverse.io/seventeen',
    badge: '公式コミュニティ',
    icon: Globe,
    color: 'from-pink-500 to-rose-400',
  },
  {
    title: 'SEVENTEEN Official YouTube',
    desc: '「GOING SEVENTEEN」やMVで笑顔をチャージ 🎥',
    url: 'https://www.youtube.com/@pledis17',
    badge: '公式YouTube',
    icon: Play,
    color: 'from-red-500 to-rose-500',
  },
  {
    title: 'SEVENTEEN Japan Official',
    desc: '日本ファンクラブ・ツアー・最新インフォメーション',
    url: 'https://www.seventeen-17.jp/',
    badge: '日本公式サイト',
    icon: ExternalLink,
    color: 'from-sky-500 to-indigo-500',
  },
  {
    title: 'SEVENTEEN on Spotify',
    desc: 'リハビリやお散歩中のBGMにぴったりなセブチ楽曲 🎶',
    url: 'https://open.spotify.com/artist/7nqOGRxlXj7N2JYbgBEjIl',
    badge: 'リハビリBGM',
    icon: Music,
    color: 'from-emerald-500 to-teal-500',
  },
];

export const CaratLoungeModal: React.FC<CaratLoungeModalProps> = ({
  isOpen,
  onClose,
  concertGoal,
  onSaveConcertGoal,
}) => {
  if (!isOpen) return null;

  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [eventName, setEventName] = useState(concertGoal.eventName);
  const [targetDate, setTargetDate] = useState(concertGoal.targetDate);
  const [targetMotto, setTargetMotto] = useState(concertGoal.targetMotto);

  // Calculate days remaining to concert
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const currentQuote = HANI_QUOTES[activeQuoteIndex % HANI_QUOTES.length];

  const handleNextHaniCheer = () => {
    triggerSparkleConfetti();
    setActiveQuoteIndex((prev) => (prev + 1) % HANI_QUOTES.length);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConcertGoal({
      eventName,
      targetDate,
      targetMotto,
    });
    setIsEditingGoal(false);
    triggerFullCelebration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-br from-[#FFF5F6] via-white to-[#EFF4FC] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-white relative text-left">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F7CAC9] to-[#92A8D1] flex items-center justify-center text-xl shadow-sm">
              💎
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-500">
                CARAT LOUNGE 🩷🩵
              </span>
              <h2 className="text-lg font-extrabold text-slate-800">
                推し活ラウンジ ＆ ジョンハン応援ルーム
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Jeonghan Special Angel Card */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border-2 border-pink-200 shadow-md relative overflow-hidden bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-[#F7CAC9] via-[#E8D1E6] to-[#92A8D1] shadow-lg">
                  <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src="/jeonghan_avatar.jpg"
                      alt="Jeonghan"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                  天使 1004 🪽
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-extrabold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-md">
                    ジョンハンからのメッセージ
                  </span>
                  <span className="text-xs text-slate-400">ハニへ〜 👼</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug mb-2">
                  「{currentQuote.quote}」
                </h3>
                <p className="text-xs text-slate-500">
                  {currentQuote.subtext}
                </p>

                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={handleNextHaniCheer}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-bold shadow-sm hover:shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ハニへ〜パワーをチャージ 💖</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Concert Motivation & Countdown Tracker */}
          <div className="glass-card rounded-3xl p-5 border border-pink-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <PartyPopper className="w-4 h-4 text-purple-600" />
                <span>次のライブ目標 ＆ カウントダウン 🎤</span>
              </h3>
              <button
                onClick={() => setIsEditingGoal(!isEditingGoal)}
                className="text-xs text-purple-600 font-bold hover:underline"
              >
                {isEditingGoal ? 'キャンセル' : '目標を編集 ✏️'}
              </button>
            </div>

            {isEditingGoal ? (
              <form onSubmit={handleSaveGoal} className="space-y-3 bg-white/80 p-4 rounded-2xl border border-purple-100">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">イベント名 / コンサート:</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full text-xs font-bold p-2 rounded-xl border border-purple-200 focus:outline-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">目標日程:</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full text-xs font-bold p-2 rounded-xl border border-purple-200 focus:outline-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">ひさこの意気込みモットー:</label>
                  <input
                    type="text"
                    value={targetMotto}
                    onChange={(e) => setTargetMotto(e.target.value)}
                    className="w-full text-xs font-bold p-2 rounded-xl border border-purple-200 focus:outline-purple-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-purple-700"
                >
                  目標を保存する ✨
                </button>
              </form>
            ) : (
              <div className="bg-gradient-to-r from-purple-100/60 via-pink-100/60 to-blue-100/60 p-4 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-white/80 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                    TARGET LIVE
                  </span>
                  <div className="text-sm sm:text-base font-extrabold text-slate-800 mt-1">
                    {concertGoal.eventName}
                  </div>
                  <div className="text-xs text-pink-600 font-bold mt-0.5">
                    「{concertGoal.targetMotto}」
                  </div>
                </div>

                <div className="text-center bg-white/90 px-4 py-2 rounded-2xl border border-purple-200 shadow-xs flex-shrink-0">
                  <div className="text-[10px] font-bold text-slate-400">本番まであと</div>
                  <div className="text-2xl font-black text-purple-700">
                    {diffDays > 0 ? `${diffDays}日` : '開催中・達成！'}
                  </div>
                  <div className="text-[9px] text-slate-400">{concertGoal.targetDate}</div>
                </div>
              </div>
            )}
          </div>

          {/* Official Fan Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-pink-600" />
              <span>SEVENTEEN 公式ファンサイト ＆ コンテンツリンク</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FAN_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.title}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-xs hover:shadow-md hover:border-pink-300 hover:scale-[1.01] transition-all flex items-start justify-between group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-tr ${link.color} text-white shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-800 group-hover:text-pink-600 transition-colors">
                            {link.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {link.desc}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-colors flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-pink-100 rounded-b-3xl text-center">
          <p className="text-xs text-slate-500">
            SEVENTEEN & ジョンハンと一緒に、毎日あせらず一歩ずつ進んでいきましょう 👼💎
          </p>
        </div>
      </div>
    </div>
  );
};
