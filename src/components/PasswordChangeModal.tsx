import React, { useState } from 'react';
import { Key, Lock, Eye, EyeOff, Save, Check, X, ShieldCheck } from 'lucide-react';
import type { AuthUser } from '../types/auth';
import { saveUserPassword } from '../firebase/credentialService';
import { triggerSparkleConfetti } from '../utils/confetti';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword.trim()) {
      setErrorMessage('新しいパスワードを入力してください。');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('パスワードは4文字以上で設定してください。');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('パスワード（確認用）が一致しません。');
      return;
    }

    setIsSaving(true);
    try {
      await saveUserPassword(
        currentUser.email,
        newPassword.trim(),
        currentUser.role,
        currentUser.tenantId,
        currentUser.customerId
      );
      triggerSparkleConfetti();
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Password change error:', err);
      setErrorMessage('パスワードの保存中にエラーが発生しました。インターネット接続をご確認ください。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                パスワードの変更・設定
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {currentUser.email}
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

        {/* User Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-700">{currentUser.name}</span>
            <div className="text-[10px] text-slate-500">
              ロール: {currentUser.role === 'admin' ? 'Cheer Master 👑' : currentUser.role === 'provider' ? 'Pro Partner 🏢' : 'My Lounge メンバー 💎'}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
            Firebaseクラウド保存
          </span>
        </div>

        {/* Notice on initial state */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
          <div className="font-bold flex items-center gap-1 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>パスワード設定について</span>
          </div>
          ここで設定したパスワードはFirebase（Firestore）に安全に保存され、次回以降のログイン時にそのパスワードの入力が必要となります。
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              新しいパスワード
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="4文字以上の新しいパスワード"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              新しいパスワード (確認)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="もう一度同じパスワードを入力"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {successNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-bounce">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>パスワードを変更しました！Firebaseに保存されました。</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span>保存中...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>パスワードを保存する</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
