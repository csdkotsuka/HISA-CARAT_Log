import React, { useState } from 'react';
import { LogIn, Mail, Lock, ShieldCheck, Building2, User, Sparkles, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import type { AuthUser } from '../types/auth';
import { DEMO_ACCOUNTS, ROLE_DEFINITIONS } from '../types/auth';
import { triggerSparkleConfetti } from '../utils/confetti';
import { getTenants, getCustomers } from '../utils/tenantStorage';
import { verifyUserPassword, getUserCredential } from '../firebase/credentialService';

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [multipleCandidates, setMultipleCandidates] = useState<AuthUser[] | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMessage('');
    setIsVerifying(true);

    const normalized = email.trim().toLowerCase();

    // 1. Password Verification via Firebase / LocalStorage
    try {
      const verifyResult = await verifyUserPassword(normalized, password);
      if (!verifyResult.success) {
        setErrorMessage(verifyResult.message || 'パスワードが正しくありません。');
        setIsVerifying(false);
        return;
      }
    } catch (err) {
      console.warn('Password verification notice:', err);
    }

    // 2. Find matching accounts
    const matchedDemo = DEMO_ACCOUNTS.filter((u) => u.email.toLowerCase() === normalized);

    if (matchedDemo.length > 1) {
      // Multiple roles found (e.g. kotsuka@creativesd.net has both Admin and Provider)
      setIsVerifying(false);
      setMultipleCandidates(matchedDemo);
      return;
    }

    if (matchedDemo.length === 1) {
      completeLogin(matchedDemo[0]);
      setIsVerifying(false);
      return;
    }

    // Check registered tenants
    const tenants = getTenants();
    const matchedTenant = tenants.find((t) => t.email?.toLowerCase() === normalized);
    if (matchedTenant) {
      completeLogin({
        id: `user-provider-${matchedTenant.id}`,
        email: normalized,
        name: matchedTenant.name,
        role: 'provider',
        tenantId: matchedTenant.id,
        description: `${matchedTenant.name} アカウント`,
      });
      setIsVerifying(false);
      return;
    }

    // Check registered customers
    const customers = getCustomers();
    const matchedCust = customers.find((c) => c.email?.toLowerCase() === normalized);
    if (matchedCust) {
      completeLogin({
        id: `user-cust-${matchedCust.id}`,
        email: normalized,
        name: matchedCust.name,
        role: 'customer',
        tenantId: matchedCust.tenantId,
        customerId: matchedCust.id,
        description: `${matchedCust.name} 専用アカウント`,
      });
      setIsVerifying(false);
      return;
    }

    // Dynamic customer user creation
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: normalized,
      name: email.split('@')[0],
      role: 'customer',
      tenantId: 'tenant-carat-hisa',
      customerId: 'cust-hisa-01',
      description: '一般メンバーアカウント',
    };
    completeLogin(newUser);
    setIsVerifying(false);
  };

  const completeLogin = (user: AuthUser) => {
    onLogin(user);
    triggerSparkleConfetti();
    setMultipleCandidates(null);
    setEmail('');
    setPassword('');
    setErrorMessage('');
    onClose();
  };

  const handleSelectDemoUser = async (user: AuthUser) => {
    setErrorMessage('');
    // Check if password has been registered for this user
    try {
      const cred = await getUserCredential(user.email);
      if (cred && cred.passwordHash) {
        // Password is set, route to email tab with email filled
        setEmail(user.email);
        setPassword('');
        setActiveTab('email');
        setErrorMessage('※ このアカウントにはパスワードが設定されています。パスワードを入力してログインしてください。');
        return;
      }
    } catch {}

    completeLogin(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn no-print">
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
          {currentUser && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quick');
              setMultipleCandidates(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'quick' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ワンクリック切替 (デモ)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setMultipleCandidates(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'email' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>メール＆パスワード</span>
          </button>
        </div>

        {/* Role selection modal if email matches multiple roles (e.g. kotsuka@creativesd.net) */}
        {multipleCandidates && (
          <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>ログインするロールを選択してください</span>
            </div>
            <p className="text-xs text-indigo-700">
              このメールアドレス（{multipleCandidates[0].email}）は複数のロールに登録されています。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {multipleCandidates.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => completeLogin(user)}
                  className="p-3 rounded-xl bg-white border-2 border-indigo-300 hover:border-indigo-600 hover:shadow-md text-left transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-2xl">{user.role === 'admin' ? '👑' : '🏢'}</span>
                  <div>
                    <div className="text-xs font-black text-slate-800">
                      {user.role === 'admin' ? 'Cheer Master (管理者)' : 'Pro Partner (CARAT担当)'}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {user.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMultipleCandidates(null)}
              className="text-xs text-slate-500 hover:text-slate-700 underline block text-center pt-1"
            >
              戻る
            </button>
          </div>
        )}

        {/* TAB 1: QUICK DEMO ACCOUNTS */}
        {activeTab === 'quick' && !multipleCandidates && (
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

        {/* TAB 2: DIRECT EMAIL & PASSWORD INPUT */}
        {activeTab === 'email' && !multipleCandidates && (
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
                  placeholder="hisako@user.cheer.app または kotsuka@creativesd.net"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  パスワード
                </label>
                <span className="text-[10px] text-slate-400">
                  初回未設定時は空欄で可
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Explanatory hint banner */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>パスワード認証とFirebase同期について</span>
              </div>
              <p>
                ・初回ログインはパスワードなし（空欄）または仮パスワードでログイン可能です。
              </p>
              <p>
                ・ログイン後、ヘッダー右上の「🔑 パスワード」からいつでもパスワードを設定・変更できます。変更後はFirebaseに同期され、次回のログイン時にそのパスワードが必要になります。
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <span>認証中...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>メールアドレスでログインする</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
