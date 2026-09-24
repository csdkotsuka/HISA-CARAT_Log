import React from 'react';
import { ShieldCheck, Building2, User, ChevronRight, ExternalLink, ArrowRightLeft } from 'lucide-react';
import type { AppMode } from '../utils/tenantStorage';
import type { Tenant, Customer } from '../types/tenant';

interface RoleNavigationHeaderProps {
  currentMode: AppMode;
  onSwitchMode: (mode: AppMode) => void;
  activeTenant: Tenant;
  activeCustomer: Customer;
  tenants: Tenant[];
  customers: Customer[];
  onSelectTenant: (tenantId: string) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const RoleNavigationHeader: React.FC<RoleNavigationHeaderProps> = ({
  currentMode,
  onSwitchMode,
  activeTenant,
  activeCustomer,
  tenants,
  customers,
  onSelectTenant,
  onSelectCustomer,
}) => {
  // Filter customers belonging to the active tenant
  const tenantCustomers = customers.filter((c) => c.tenantId === activeTenant.id);

  return (
    <div className="w-full bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-50 transition-all text-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Role Switcher Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
            <span>階層切替:</span>
          </span>

          {/* 1. Admin Tab */}
          <button
            onClick={() => onSwitchMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentMode === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>① 管理者 (自社)</span>
          </button>

          {/* 2. Provider Tab */}
          <button
            onClick={() => onSwitchMode('provider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentMode === 'provider'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>② 業者ページ</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded font-mono text-amber-200">
              {activeTenant.name.slice(0, 8)}..
            </span>
          </button>

          {/* 3. Customer Tab */}
          <button
            onClick={() => onSwitchMode('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentMode === 'customer'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-300" />
            <span>③ 顧客ページ</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded font-mono text-emerald-200">
              {activeCustomer.nickname || activeCustomer.name}
            </span>
          </button>
        </div>

        {/* Right: ID Linkage Indicators & Quick Pickers */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end text-[11px] bg-slate-800/60 p-1 rounded-lg border border-slate-700/60">
          {/* Active Tenant Selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium hidden sm:inline">業者ID:</span>
            <select
              value={activeTenant.id}
              onChange={(e) => onSelectTenant(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              title="連携する業者を切り替え"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id})
                </option>
              ))}
            </select>
          </div>

          <ChevronRight className="w-3 h-3 text-slate-500" />

          {/* Active Customer Selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium hidden sm:inline">顧客ID:</span>
            <select
              value={activeCustomer.id}
              onChange={(e) => onSelectCustomer(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
              title="業者に紐づく顧客を切り替え"
            >
              {tenantCustomers.length > 0 ? (
                tenantCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nickname || c.name} ({c.id})
                  </option>
                ))
              ) : (
                <option value={activeCustomer.id}>
                  {activeCustomer.nickname || activeCustomer.name} ({activeCustomer.id})
                </option>
              )}
            </select>
          </div>

          {/* Quick Preview Badge */}
          {currentMode === 'provider' && (
            <button
              onClick={() => onSwitchMode('customer')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all font-semibold"
              title="この業者の設定で顧客ページを開く"
            >
              <span>顧客画面へ</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {currentMode === 'customer' && (
            <button
              onClick={() => onSwitchMode('provider')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-semibold"
              title="業者ページへ戻る"
            >
              <span>業者設定へ</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
