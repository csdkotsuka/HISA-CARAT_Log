import React from 'react';
import { CalendarHeart, ClipboardCheck, LineChart } from 'lucide-react';

export type ActiveTab = 'daily' | 'pt-eval' | 'dashboard';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  ptDocksCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  ptDocksCount,
}) => {
  const tabs = [
    {
      id: 'daily' as ActiveTab,
      label: '日々の記録',
      sub: 'セルフチェック',
      icon: CalendarHeart,
      color: 'from-pink-400 to-rose-400',
    },
    {
      id: 'pt-eval' as ActiveTab,
      label: '和宏先生の評価ドック',
      sub: '定期PTカルテ',
      icon: ClipboardCheck,
      badge: `${ptDocksCount}回実施`,
      color: 'from-purple-400 to-indigo-400',
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'グラフと履歴',
      sub: '回復トレンド',
      icon: LineChart,
      color: 'from-sky-400 to-blue-400',
    },
  ];

  return (
    <nav className="mb-6 sticky top-2 z-20">
      <div className="glass-card rounded-2xl p-1.5 flex items-center justify-between gap-1 sm:gap-2 shadow-md border border-white/90">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-2 sm:gap-2.5 transition-all text-center ${
                isActive
                  ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-md shadow-pink-200/50 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-extrabold leading-tight flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold hidden md:inline ${
                        isActive ? 'bg-white/30 text-white' : 'bg-pink-100 text-pink-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] hidden sm:block leading-none mt-0.5 ${
                    isActive ? 'text-white/80 font-medium' : 'text-slate-400'
                  }`}
                >
                  {tab.sub}
                </div>
              </div>

              {isActive && (
                <span className="absolute -top-1 -right-1 text-xs animate-spin-slow">
                  ✨
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
