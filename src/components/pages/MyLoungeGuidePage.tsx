import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';

interface MyLoungeGuidePageProps {
  onBackToApp: () => void;
}

export const MyLoungeGuidePage: React.FC<MyLoungeGuidePageProps> = ({
  onBackToApp,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFF9FA] to-[#F2F6FC] text-slate-800 font-sans pb-24">
      {/* Top sticky nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💎</span>
          <span className="font-extrabold text-lg bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
            My Lounge
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
            メンバー向け使い方ガイド
          </span>
        </div>

        <button
          onClick={onBackToApp}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>マイラウンジに戻る</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-12 sm:pt-16 pb-10 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-200 text-pink-600 text-xs font-bold shadow-xs">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>自分らしさを大切にする、毎日の優しい居場所</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          毎日の小さな記録が、<br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            私をちょっと好きになる。
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
          My Loungeは、誰かと比べるためではなく、あなた自身が心地よく前に進むためのプライベート空間です。推し活のときめきも、日々のリハビリやトレーニングの頑張りも、そっと優しく受け止めます。
        </p>
      </section>

      {/* 4 Steps to Enjoy My Lounge */}
      <section className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-center text-slate-800">
          My Lounge を楽しむ4つのステップ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-pink-100 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">
                1日30秒。気分をポンと押すだけ
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              朝起きたときや夜寝る前、今日の気分アイコンをタップ。チェックリストもワンタップでチェックできます。完璧に書かなくても、1つ記録するだけで花吹雪でお祝いします✨
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-purple-100 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">
                パートナーをタップして元気チャージ
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ヘッダーのアバターをタップすると、あなただけに向けた励ましメッセージを喋ってくれます。日替わりの温かい言葉が、疲れた日の心をふっと軽くしてくれます。
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-sky-100 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">
                グラフとカレンダーで「できた」を実感
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              カレンダーにはスタンプが並び、グラフにはあなたの積み重ねが描かれます。「こんなに続けてこれたんだ」という実感が、明日の自信につながります。
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm">
                04
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">
                安心のプライベート空間
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              他のユーザーやSNSに見られる心配はありません。あなたと、あなたの信頼するパートナー（トレーナーや先生、医療職）だけの安全で温かいお部屋です。
            </p>
          </div>
        </div>
      </section>

      {/* Gentle Message & Back button */}
      <section className="max-w-2xl mx-auto px-4 py-10 text-center space-y-5">
        <div className="p-6 rounded-3xl bg-white/80 border border-pink-100 shadow-sm space-y-3">
          <div className="text-2xl">☕</div>
          <h3 className="text-base font-extrabold text-slate-800">
            無理のないペースが、いちばん続く魔法。
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            記録を忘れる日があっても大丈夫。いつでも気が向いたときにMy Loungeを開いてみてくださいね。
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToApp}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>マイラウンジで記録をつける</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
