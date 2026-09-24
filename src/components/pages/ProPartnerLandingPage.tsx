import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Bot,
  Palette,
  TrendingUp,
} from 'lucide-react';

interface ProPartnerLandingPageProps {
  onBackToAdmin: () => void;
}

export const ProPartnerLandingPage: React.FC<ProPartnerLandingPageProps> = ({
  onBackToAdmin,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8FA] via-[#F8FAFC] to-[#F0FDF4] text-slate-800 font-sans pb-24">
      {/* Top sticky nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="font-extrabold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Cheer Pro Partner
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
            事業者・専門職向けPR
          </span>
        </div>

        <button
          onClick={onBackToAdmin}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Master Consoleに戻る</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 sm:pt-20 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold animate-pulse">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>あなたの専門知見と想いが、そのまま専用アプリになる</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          現場のぬくもりと顧客の伴走を、<br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            たった1日で自社ブランドアプリへ。
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
          Cheerは、医療・福祉・教育・フィールド現場・地域サロン・推し活まで、あらゆる業界の顧客伴走を手軽にデジタル化できる汎用パートナーSaaSです。専門的な開発費や月日は一切不要。ブランドカラー、AIペルソナ、日々の記録項目を選ぶだけで、即日顧客へ提供できます。
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>自社ロゴ・10色カラー対応</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>AIアバター＆ペルソナ自動生成</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>日々の記録＆定期評価を自由設計</span>
          </div>
        </div>
      </section>

      {/* 5 Main Industry Solution Showcases */}
      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            5つの主要領域で爆発する現場の知見
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            貴社の業種に合わせた最適なテンプレートを選ぶだけで、すぐに運用を開始できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Medical & Care */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-teal-150 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🩺</span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                医療・福祉・ケア
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              訪問看護・介護・障がい者就労支援
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              現場の「動態×バイタル」を関係者でリアルタイム共有。体温・血圧・SpO2・作業気分の波を簡単記録。自治体提出用の支援記録もAIが支援します。
            </p>
            <div className="text-[11px] text-teal-700 font-bold bg-teal-50/70 p-2.5 rounded-xl">
              💡 訪問看護ステーション、就労継続支援A/B型、接骨院・整体院、小規模デイ
            </div>
          </div>

          {/* Card 2: Field & Construction */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-orange-150 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🏗️</span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                現場・建設・フィールド
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              造園・外構・ビル清掃・遊漁船
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              現場写真と位置情報で、資材使用量や日報作成を自動化。出港前点検や釣果速報、広い施設での作業完了証明もスマホ1台で完結します。
            </p>
            <div className="text-[11px] text-orange-700 font-bold bg-orange-50/70 p-2.5 rounded-xl">
              💡 造園外構業者、ビルメンテ・清掃、遊漁船・レジャー、山林安全作業
            </div>
          </div>

          {/* Card 3: Local Services */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-rose-150 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">✂️</span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                地域密着・ライフサービス
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              ペットサロン・自動車整備・寺院
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              「噛み癖」「毛並み」「修理の進捗」など個体ごとの細かなカルテを写真付きで記録。適切なタイミングで次回リピート案内をお届けできます。
            </p>
            <div className="text-[11px] text-rose-700 font-bold bg-rose-50/70 p-2.5 rounded-xl">
              💡 ペットサロン・トリミング、鈑金・自動車工場、寺院・納骨堂
            </div>
          </div>

          {/* Card 4: Education & Community */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-blue-150 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🎓</span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                教育・実習・BtoB
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              個別学習塾・学生インターン実習
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              授業後の学習記録や生徒のつまずきを可視化。保護者への丁寧な報告文作成や、大学×企業の実習進行を1つのタイムラインで共有します。
            </p>
            <div className="text-[11px] text-blue-700 font-bold bg-blue-50/70 p-2.5 rounded-xl">
              💡 個別指導塾、家庭教師、地域インターンシップ、農機具シェア
            </div>
          </div>

          {/* Card 5: Cheer & Personal Life */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-pink-150 shadow-sm hover:shadow-md transition-all space-y-3 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">💎</span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-pink-50 text-pink-800 border border-pink-200">
                推し活・ウェルネス・自己実現
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              推し活ダイアリー・パーソナルジム・ヨガ習慣化
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              「大好きな推しと一緒にリハビリを頑張る」「トレーナーと一緒に体脂肪率15%を目指す」など、エモーショナルな力で日々の継続を強力にドライブします。
            </p>
            <div className="text-[11px] text-pink-700 font-bold bg-pink-50/70 p-2.5 rounded-xl">
              💡 アイドル・アーティストファンコミュニティ、フィットネスジム、ヨガスクール
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Features */}
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900">
          Pro Partnerを支える3つの強力な機能
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">10色の業界別テーマカラー</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ワンクリックで業界やブランドイメージに合った配色に切り替え。自社のHEXカラーコード指定も可能です。
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">AIアバター＆ペルソナ設定</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              プロンプトからアバター画像を自動生成。口調や励ましメッセージをセットし、顧客に愛される専属パートナーを作れます。
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">顧客の求める指標に自動最適化</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              日々のチェック項目やスライダー、数値項目を自由に設定。顧客のダッシュボードやグラフも自動で連動します。
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black">
            今日から、あなたの事業専用のパートナーアプリを。
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            まずはMaster Consoleから新規業者アカウントを発行して、顧客画面プレビューをお試しください。
          </p>
          <button
            onClick={onBackToAdmin}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-90 font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Master Consoleで業者を設定する</span>
            <span>→</span>
          </button>
        </div>
      </section>
    </div>
  );
};
