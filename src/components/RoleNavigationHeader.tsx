import React from 'react';
import { ShieldCheck, Building2, User, ChevronRight, LogIn, LogOut, ArrowRightLeft, RefreshCw } from 'lucide-react';
import type { AppMode } from '../utils/tenantStorage';
import type { Tenant, Customer } from '../types/tenant';
import type { AuthUser } from '../types/auth';
import { ROLE_DEFINITIONS } from '../types/auth';

interface RoleNavigationHeaderProps {
  currentMode: AppMode;
  onSwitchMode: (mode: AppMode) => void;
  activeTenant: Tenant;
  activeCustomer: Customer;
  tenants: Tenant[];
  customers: Customer[];
  onSelectTenant: (tenantId: string) => void;
  onSelectCustomer: (customerId: string) => void;
  currentUser: AuthUser | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  cloudStatus?: 'synced' | 'syncing' | 'offline';
  onSyncFirestore?: () => void;
  isSyncingFirestore?: boolean;
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
  currentUser,
  onOpenLoginModal,
  onLogout,
  cloudStatus = 'synced',
  onSyncFirestore,
  isSyncingFirestore = false,
}) => {
  const userRole = currentUser?.role || 'customer';
  const roleMeta = currentUser ? ROLE_DEFINITIONS[userRole] : ROLE_DEFINITIONS.customer;

  // Filter customers belonging to the active tenant
  const tenantCustomers = customers.filter((c) => c.tenantId === activeTenant.id);

  // If customer role, do NOT show the admin/provider switching bar at all! Only show sleek personal header bar
  if (userRole === 'customer') {
    return (
      <div className="w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-sm sticky top-0 z-50 text-xs no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
          {/* Left: App Logo & User space name */}
          <div className="flex items-center gap-2">
            <span className="text-sm">✨</span>
            <span className="font-extrabold tracking-tight bg-gradient-to-r from-pink-400 to-indigo-300 bg-clip-text text-transparent">
              Cheer
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <span>{ROLE_DEFINITIONS.customer.label}</span>
              <span className="text-[10px] text-pink-400 font-normal">({activeCustomer.nickname || activeCustomer.name} 専用)</span>
            </span>
          </div>

          {/* Right: User Status, Cloud Sync & Account switch button */}
          <div className="flex items-center gap-2">
            {onSyncFirestore && (
              <button
                type="button"
                onClick={onSyncFirestore}
                disabled={isSyncingFirestore}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700 hover:bg-indigo-900 text-indigo-200 text-[10px] font-bold transition-all shadow-xs disabled:opacity-50"
                title="ローカルの全データをFirebase (Firestore) に即時同期"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingFirestore ? 'animate-spin text-amber-400' : 'text-indigo-400'}`} />
                <span>{isSyncingFirestore ? '同期中...' : '🔥 Firebase同期'}</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${cloudStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : cloudStatus === 'syncing' ? 'bg-amber-400 animate-spin' : 'bg-rose-400'}`} />
              <span className="text-slate-300 font-medium">{currentUser?.email}</span>
            </div>

            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-bold transition-all"
              title="別のアカウントでログイン"
            >
              <LogIn className="w-3 h-3 text-indigo-400" />
              <span>切替</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-300 text-[11px] font-bold transition-all"
              title="ログアウト"
            >
              <LogOut className="w-3 h-3" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Provider or Admin Role View
  return (
    <div className="w-full bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-50 transition-all text-xs no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Role Navigation Tabs with Permissions */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
            <span>Studio切替:</span>
          </span>

          {/* 1. Admin Tab: ONLY visible to Admin */}
          {userRole === 'admin' && (
            <button
              onClick={() => onSwitchMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentMode === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>👑 {ROLE_DEFINITIONS.admin.label} (HQ Studio)</span>
            </button>
          )}

          {/* 2. Provider Tab: Visible to Admin and Provider */}
          <button
            onClick={() => onSwitchMode('provider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentMode === 'provider'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>🏢 {ROLE_DEFINITIONS.provider.label} (Partner)</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded font-mono text-amber-200">
              {activeTenant.name.slice(0, 8)}..
            </span>
          </button>

          {/* 3. Customer Tab: Visible to Admin, Provider, and Customer */}
          <button
            onClick={() => onSwitchMode('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentMode === 'customer'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-300" />
            <span>💎 {ROLE_DEFINITIONS.customer.label} (顧客画面)</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded font-mono text-emerald-200">
              {activeCustomer.nickname || activeCustomer.name}
            </span>
          </button>
        </div>

        {/* Right: Tenant/Customer Selectors & User Info */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end text-[11px]">
          {/* Selectors only for Admin or Provider */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {/* If admin, can pick any tenant */}
            {userRole === 'admin' && (
              <>
                <select
                  value={activeTenant.id}
                  onChange={(e) => onSelectTenant(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  title="連携する業者を切り替え"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </>
            )}

            {/* Customer selector */}
            <select
              value={activeCustomer.id}
              onChange={(e) => onSelectCustomer(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
              title="業者に紐づく顧客を切り替え"
            >
              {tenantCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nickname || c.name}
                </option>
              ))}
            </select>
          </div>

          {/* User profile, Cloud Sync & Login switcher */}
          <div className="flex items-center gap-1.5">
            {onSyncFirestore && (
              <button
                type="button"
                onClick={onSyncFirestore}
                disabled={isSyncingFirestore}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700 hover:bg-indigo-900 text-indigo-200 text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                title="ローカルの全データ(テナント・顧客・日報・評価)をFirebase (Firestore) に即時同期"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFirestore ? 'animate-spin text-amber-400' : 'text-indigo-400'}`} />
                <span>{isSyncingFirestore ? '同期中...' : '🔥 Firebase同期'}</span>
              </button>
            )}

            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-[10px]">
              <span className={`w-2 h-2 rounded-full ${cloudStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : cloudStatus === 'syncing' ? 'bg-amber-400 animate-spin' : 'bg-rose-400'}`} />
              <span className="text-slate-400">{cloudStatus === 'synced' ? 'Cloud同期済' : cloudStatus === 'syncing' ? '同期中' : 'オフライン'}</span>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300 hidden lg:inline">
              {currentUser?.name} ({roleMeta.badge})
            </span>

            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold transition-all shadow-xs"
              title="別のアカウントにログイン"
            >
              <LogIn className="w-3 h-3" />
              <span className="hidden sm:inline">アカウント切替</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-300 font-bold transition-all shadow-xs"
              title="ログアウト"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
