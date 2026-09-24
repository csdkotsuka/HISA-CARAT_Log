import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Save, Check, X, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import type { AuthUser } from '../types/auth';
import type { Customer } from '../types/tenant';
import { saveUserPassword } from '../firebase/credentialService';
import { triggerSparkleConfetti } from '../utils/confetti';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  activeCustomer?: Customer;
  onUpdateCustomer?: (customer: Customer) => void;
  onUpdateCurrentUser?: (user: AuthUser) => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeCustomer,
  onUpdateCustomer,
  onUpdateCurrentUser,
}) => {
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      if (activeCustomer) {
        setNickname(activeCustomer.nickname || activeCustomer.name || '');
      } else {
        setNickname(currentUser.name || '');
      }
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
    }
  }, [currentUser, activeCustomer, isOpen]);

  if (!isOpen || !currentUser) return null;

  const isCustomer = currentUser.role === 'customer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('有効なメールアドレスを入力してください。');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('お名前を入力してください。');
      return;
    }

    // If password is being changed, validate it
    const hasPasswordInput = newPassword.trim().length > 0;
    if (hasPasswordInput) {
      if (newPassword.length < 4) {
        setErrorMessage('パスワードは4文字以上で設定してください。');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('パスワード（確認用）が一致しません。');
        return;
      }
    }

    setIsSaving(true);
    try {
      // 1. Update customer if customer role
      if (isCustomer && activeCustomer && onUpdateCustomer) {
        const updatedCust: Customer = {
          ...activeCustomer,
          name: name.trim(),
          nickname: nickname.trim() || name.trim(),
          email: email.trim().toLowerCase(),
        };
        onUpdateCustomer(updatedCust);
      }

      // 2. Update currentUser
      if (onUpdateCurrentUser) {
        const updatedAuth: AuthUser = {
          ...currentUser,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        };
        onUpdateCurrentUser(updatedAuth);
      }

      // 3. Save password to Firebase if entered
      if (hasPasswordInput) {
        await saveUserPassword(
          email.trim().toLowerCase(),
          newPassword.trim(),
          currentUser.role,
          currentUser.tenantId,
          currentUser.customerId
        );
      }

      triggerSparkleConfetti();
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Account update error:', err);
      setErrorMessage('設定の保存中にエラーが発生しました。インターネット接続をご確認ください。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                マイページ・アカウント設定
              </h3>
              <p className="text-xs text-slate-500">
                表示名・アカウント情報・パスワード変更
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-700">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500">
              ロール: {currentUser.role === 'admin' ? 'Cheer Master 👑' : currentUser.role === 'provider' ? 'Pro Partner 🏢' : 'My Lounge メンバー 💎'}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
            Firebaseクラウド保存
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Display Name (Nickname) */}
          {isCustomer && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>表示名（ニックネーム・呼称）</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                placeholder="例: ひさこさん"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400/20 focus:border-pink-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                ※ 画面上部に「（{nickname || '〇〇'}専用）」として表示されるお名前です。
              </p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              お名前（氏名）
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="例: 大塚 寿子"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              メールアドレス（ログイン用）
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Password Header / Divider */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>パスワードの変更（任意）</span>
              </span>
              <span className="text-[10px] text-slate-400">変更しない場合は空欄</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  新しいパスワード
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="変更する場合のみ4文字以上で入力"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? '非表示' : '表示'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {newPassword && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    新しいパスワード（確認用）
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="もう一度同じパスワードを入力"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {successNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-bounce">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>マイページ情報を保存しました！Firebaseに反映されました。</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span>保存中...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>変更を保存する</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
