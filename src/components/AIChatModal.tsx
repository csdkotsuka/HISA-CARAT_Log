import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, RefreshCw } from 'lucide-react';
import type { Tenant, Customer } from '../types/tenant';
import type { ChatMessage } from '../utils/geminiChat';
import {
  sendChatMessageToGemini,
  getGeminiApiKey,
  getGeminiModel,
} from '../utils/geminiChat';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  customer: Customer;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  tenant,
  customer,
}) => {
  const p = tenant.aiPersona;
  const initialGreeting =
    p.chatGreeting ||
    p.speechBubbleText ||
    `${customer.nickname || customer.name}さん、会えて嬉しいよ！今日も何でも気軽に話してね✨`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-init',
      role: 'model',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiKey = getGeminiApiKey();
  const currentModel = getGeminiModel();

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessageToGemini(updatedMessages, tenant, customer);
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: response.modelUsed,
        isAi: response.isAi,
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (e: any) {
      console.error(e);
      const errMsg = e.message || '通信エラーが発生しました';
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: `⚠️ ${errMsg}\n\n（※Cheer Master画面でAPIキーやモデルの設定をご確認ください）`,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'model',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick suggestion chips based on industry
  const quickSuggestions =
    tenant.industry === 'idol'
      ? ['今日ちょっと疲れちゃった...', '今日のセルフケア完了したよ！', '元気が出る言葉ちょうだい！👼', 'ずっと応援してるよ！💎']
      : tenant.industry === 'fitness'
      ? ['筋トレ頑張ったよ！🔥', '筋肉痛で少ししんどい...', 'モチベーション上げる言葉を！', '今日の食事報告するね']
      : tenant.industry === 'education'
      ? ['今日の勉強目標達成！✏️', '解けない問題があって落ち込んでる', '先生、褒めて！', '明日のアドバイスちょうだい']
      : ['今日の目標達成したよ！✨', 'ちょっと疲れたな...', 'アドバイスしてほしい！', '話を聞いてくれてありがとう'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full h-[90vh] sm:h-[620px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-left relative animate-scale-up">
        {/* Header */}
        <div
          className="p-4 border-b border-white/20 text-white flex items-center justify-between shadow-xs relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.secondaryColor})`,
          }}
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-md bg-white flex-shrink-0 relative">
              <img
                src={p.avatarUrl}
                alt={p.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white drop-shadow-xs">{p.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold backdrop-blur-xs">
                  {p.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/90 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span>{apiKey ? `Gemini (${currentModel}) 連携中` : '本人対話モード'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 relative z-10">
            <button
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="会話をリセット"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0 mb-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                    msg.isError
                      ? 'bg-rose-50 text-rose-900 border border-rose-300 rounded-bl-xs'
                      : isModel
                      ? 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      : 'text-white font-medium rounded-br-xs'
                  }`}
                  style={{
                    backgroundColor: !isModel ? tenant.theme.primaryColor : undefined,
                  }}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-1.5 flex items-center justify-between gap-2 ${
                      isModel ? 'text-slate-400' : 'text-white/80 justify-end'
                    }`}
                  >
                    {isModel && msg.isError && (
                      <span className="font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                        ⚠️ 通信エラー
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-fade-in">
              <img
                src={p.avatarUrl}
                alt={p.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0 mb-1"
              />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-400 ml-1.5 font-bold">
                  {p.name}が入力中...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 font-bold flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>ひとこと:</span>
          </span>
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-pink-300 text-slate-700 font-medium whitespace-nowrap hover:bg-pink-50/50 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`${p.name}にメッセージを送る...`}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl text-white font-bold disabled:opacity-40 shadow-sm transition-all cursor-pointer flex-shrink-0"
            style={{
              backgroundColor: tenant.theme.primaryColor,
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
