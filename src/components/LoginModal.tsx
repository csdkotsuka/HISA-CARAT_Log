import React, { useState } from 'react';
import { LogIn, Mail, Lock, ShieldCheck, Building2, User, Sparkles, ArrowRight } from 'lucide-react';
import type { AuthUser } from '../types/auth';
import { DEMO_ACCOUNTS, ROLE_DEFINITIONS } from '../types/auth';
import { triggerSparkleConfetti } from '../utils/confetti';
import { getTenants, getCustomers } from '../utils/tenantStorage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  currentUser: AuthUser | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'email'>('quick');

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const normalized = email.trim().toLowerCase();
    const matched = DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === normalized);
    if (matched) {
      onLogin(matched);
    } else {
      // Check registered tenants
      const tenants = getTenants();
      const matchedTenant = tenants.find((t) => t.email?.toLowerCase() === normalized);
      if (matchedTenant) {
        onLogin({
          id: `user-provider-${matchedTenant.id}`,
          email: normalized,
          name: matchedTenant.name,
          role: 'provider',
          tenantId: matchedTenant.id,
          description: `${matchedTenant.name} アカウント`,
        });
      } else {
        // Check registered customers
        const customers = getCustomers();
        const matchedCust = customers.find((c) => c.email?.toLowerCase() === normalized);
        if (matchedCust) {
          onLogin({
            id: `user-cust-${matchedCust.id}`,
            email: normalized,
            name: matchedCust.name,
            role: 'customer',
            tenantId: matchedCust.tenantId,
            customerId: matchedCust.id,
            description: `${matchedCust.name} 専用アカウント`,
          });
        } else {
          // Dynamic user creation
          const newUser: AuthUser = {
            id: `user-${Date.now()}`,
            email: normalized,
            name: email.split('@')[0],
            role: 'customer',
            tenantId: 'tenant-carat-hisa',
            customerId: 'cust-hisa-01',
            description: '一般メンバーアカウント',
          };
          onLogin(newUser);
        }
      }
    }
    triggerSparkleConfetti();
    onClose();
  };

  const handleSelectDemoUser = (user: AuthUser) => {
    onLogin(user);
    triggerSparkleConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
              ✨
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>Cheer アカウントログイン</span>
              </h2>
              <p className="text-xs text-slate-500">
                ロールに応じた画面（Master HQ / Pro Partner / My Lounge）へ切り替えます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'quick' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ワンクリック切り替え (デモアカウント)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'email' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>メールアドレス直接入力</span>
          </button>
        </div>

        {/* TAB 1: QUICK DEMO ACCOUNTS */}
        {activeTab === 'quick' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* 1. Master Console (Admin) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{ROLE_DEFINITIONS.admin.label} ({ROLE_DEFINITIONS.admin.subLabel})</span>
              </span>
              {DEMO_ACCOUNTS.filter((u) => u.role === 'admin').map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectDemoUser(u)}
                  className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex items-center justify-between hover:scale-[1.01] ${
                    currentUser?.id === u.id
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                      👑
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({u.email})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{u.description}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <span>選択</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>

            {/* 2. Pro Partner (Provider) */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{ROLE_DEFINITIONS.provider.label} ({ROLE_DEFINITIONS.provider.subLabel})</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_ACCOUNTS.filter((u) => u.role === 'provider').map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleSelectDemoUser(u)}
                    className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex items-center justify-between hover:scale-[1.01] ${
                      currentUser?.id === u.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold">
                        🏢
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({u.email})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{u.description}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <span>選択</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. My Lounge (Customer) */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{ROLE_DEFINITIONS.customer.label} ({ROLE_DEFINITIONS.customer.subLabel})</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_ACCOUNTS.filter((u) => u.role === 'customer').map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleSelectDemoUser(u)}
                    className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex items-center justify-between hover:scale-[1.01] ${
                      currentUser?.id === u.id
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-bold">
                        💎
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({u.email})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{u.description}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <span>選択</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT EMAIL INPUT */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ログイン用メールアドレス
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@cheer.app または your-email@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ※デモメールアドレスを入力すると該当ロール（管理者・業者・顧客）に即座にログインされます。
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                パスワード (テスト中は任意)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (空欄でもログイン可能)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>メールアドレスでログインする</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
