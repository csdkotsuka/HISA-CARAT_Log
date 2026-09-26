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
      label: '記録',
      icon: CalendarHeart,
      color: 'from-pink-400 to-rose-400',
    },
    {
      id: 'pt-eval' as ActiveTab,
      label: '定期チェック',
      icon: ClipboardCheck,
      badge: ptDocksCount > 0 ? `${ptDocksCount}` : undefined,
      color: 'from-purple-400 to-indigo-400',
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'グラフ・履歴',
      icon: LineChart,
      color: 'from-sky-400 to-blue-400',
    },
  ];

  return (
    <nav className="mb-5 sticky top-2 z-20">
      <div className="glass-card rounded-2xl p-1 flex items-center justify-between gap-1 sm:gap-2 shadow-sm border border-white/90">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 py-2 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all text-center ${
                isActive
                  ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="flex items-center gap-1 text-xs sm:text-sm leading-tight">
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
