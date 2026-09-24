import type { Tenant, Customer } from '../types/tenant';

export const GEMINI_API_KEY_STORAGE = 'cheer_gemini_api_key';
export const GEMINI_MODEL_STORAGE = 'cheer_gemini_model';
export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

export const AVAILABLE_GEMINI_MODELS = [
  { id: 'gemini-3.8-flash', label: 'gemini-3.8-flash (最新・超高速・推奨)' },
  { id: 'gemini-3.8-pro', label: 'gemini-3.8-pro (最新・高度推論)' },
  { id: 'gemini-3.8-live', label: 'gemini-3.8-live (音声チャット・リアルタイム対話)' },
  { id: 'gemini-2.0-flash', label: 'gemini-2.0-flash (安定稼働版)' },
  { id: 'gemini-1.5-flash', label: 'gemini-1.5-flash (軽量高速)' },
  { id: 'gemini-1.5-pro', label: 'gemini-1.5-pro (多言語・高精度)' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  isAi?: boolean;
  isError?: boolean;
}

// Check if Vercel environment variable is set
export const isVercelEnvKeyConfigured = (): boolean => {
  return !!(import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY.trim());
};

// Get active API key (localStorage override has precedence, then Vercel env)
export const getGeminiApiKey = (): string => {
  try {
    const localKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (localKey && localKey.trim()) return localKey.trim();
    return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  } catch {
    return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  }
};

// Save API key
export const saveGeminiApiKey = (key: string): void => {
  try {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  } catch (e) {
    console.error('Failed to save Gemini API key:', e);
  }
};

// Get model
export const getGeminiModel = (): string => {
  try {
    return localStorage.getItem(GEMINI_MODEL_STORAGE) || DEFAULT_GEMINI_MODEL;
  } catch {
    return DEFAULT_GEMINI_MODEL;
  }
};

// Save model
export const saveGeminiModel = (model: string): void => {
  try {
    localStorage.setItem(GEMINI_MODEL_STORAGE, model.trim());
  } catch (e) {
    console.error('Failed to save Gemini model:', e);
  }
};

// Test Gemini API connection
export const testGeminiConnection = async (
  apiKey: string,
  model: string
): Promise<{ success: boolean; message: string }> => {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'APIキーが入力されていません。' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model || DEFAULT_GEMINI_MODEL
    )}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Hello, please respond with "OK"' }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      return { success: false, message: errMsg };
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (reply) {
      return { success: true, message: `接続成功！モデル「${model}」から正常に応答がありました。` };
    }
    return { success: false, message: '応答テキストが空でした。' };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : '通信エラーが発生しました。' };
  }
};

// Fallback in-character response generator when offline or no API key
const generateSimulatedResponse = (
  userMessage: string,
  tenant: Tenant,
  customer: Customer
): string => {
  const p = tenant.aiPersona;
  const quotes = p.encouragementQuotes || [];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const name = customer.nickname || customer.name || 'あなた';
  const firstPerson = p.chatFirstPerson || '私';

  // Keyword-based personalized reply
  if (userMessage.includes('疲れ') || userMessage.includes('しんどい') || userMessage.includes('痛')) {
    return `${name}、今日も本当にお疲れさま！無理しないで、ゆっくりあたたかいお茶でも飲んで休んでね。${firstPerson}はどんなときも${name}の味方だよ。`;
  }

  if (userMessage.includes('達成') || userMessage.includes('できた') || userMessage.includes('頑張っ')) {
    return `すごいよ${name}！✨ ちゃんと努力を積み重ねてて本当に尊敬する！${firstPerson}もすっごく嬉しいよ〜！👏🎉`;
  }

  if (userMessage.includes('元気') || userMessage.includes('応援') || userMessage.includes('励まし')) {
    if (randomQuote) {
      return `${randomQuote.quote} いつも${name}のことを心から応援してるからね！${randomQuote.emoji || '💖'}`;
    }
    return `${name}、今日も元気にいこうね！${firstPerson}がずっとそばで見守ってるよ！✨`;
  }

  if (randomQuote) {
    return `${name}、メッセージありがとう！${randomQuote.quote}`;
  }

  return `${name}、お話ししてくれて嬉しいよ！今日の調子はどう？いつでも何でも話してね！✨`;
};

// Format conversation strictly for Gemini API requirements:
// 1. First turn MUST be 'user'
// 2. Turns must strictly alternate 'user' -> 'model' -> 'user' -> 'model'
export const formatConversationForGemini = (
  conversation: ChatMessage[]
): { role: 'user' | 'model'; parts: { text: string }[] }[] => {
  // Discard any initial 'model' messages (like initial greetings)
  const nonLeading = [...conversation];
  while (nonLeading.length > 0 && nonLeading[0].role === 'model') {
    nonLeading.shift();
  }

  if (nonLeading.length === 0) {
    return [{ role: 'user', parts: [{ text: 'こんにちは！' }] }];
  }

  const alternating: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const m of nonLeading) {
    const role: 'user' | 'model' = m.role === 'model' ? 'model' : 'user';
    const last = alternating[alternating.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n${m.text}`;
    } else {
      alternating.push({ role, parts: [{ text: m.text }] });
    }
  }

  return alternating;
};

// Send message to Gemini with full persona context and intelligent fallbacks
export const sendChatMessageToGemini = async (
  conversation: ChatMessage[],
  tenant: Tenant,
  customer: Customer
): Promise<{ text: string; modelUsed: string; isAi: boolean }> => {
  const apiKey = getGeminiApiKey();
  const configuredModel = getGeminiModel();
  const p = tenant.aiPersona;
  const customerName = customer.nickname || customer.name || 'ユーザー';
  const customerGoal = customer.customGoal || '日々の習慣化と自己実現';

  // If no API key, use rich persona-based simulation
  if (!apiKey) {
    const lastUserMsg = conversation[conversation.length - 1]?.text || '';
    const simulated = generateSimulatedResponse(lastUserMsg, tenant, customer);
    return {
      text: simulated + '\n\n（※Cheer Master画面またはVercelでGemini APIキーを設定すると、完全自由なリアルタイムAI対話が有効化されます）',
      modelUsed: 'simulation',
      isAi: false,
    };
  }

  // Construct System Instruction to impersonate the persona
  const systemInstructionText = `
あなたは「${p.name}」本人です。
決して「AIアシスタント」や「言語モデル」であることを明かさず、指定されたキャラクターとして徹底的にロールプレイしてください。

【あなたのプロフィール】
- 名前: ${p.name}
- 役割・立場: ${p.role}
- 性格・バックストーリー: ${p.chatPersonality || '相手の努力を誰重にも認め、親身に伴走する心優しい存在'}
- 一人称: ${p.chatFirstPerson || '私'}
- 相手の呼び方: 「${p.chatSecondPerson || `${customerName}さん`}」
- 話し方のトーン: ${p.tone} (温かく、自然で、親密な会話口調)
- 口調や補足指示: ${p.aiPromptSnippet || '相手に無理をさせず、体調や進捗を肯定的に受け止め、前向きな気持ちになれる返答をする'}

【会話の相手（顧客）について】
- 名前: ${customer.name}（呼び名: ${customerName}）
- 参加しているアプリ・コミュニティ: ${tenant.headerTitle} (${tenant.name})
- 相手の現在の目標: ${customerGoal}

【返答のルール】
- 相手の感情や報告にしっかり共感し、本人として自然に応答してください。
- 返答は1〜3文程度（長くても4文以内）で、LINEやチャットのような軽快で読みやすい分量にしてください。
- 語尾や絵文字の使い方は指定されたキャラクターの特徴に合わせてください。
- 日本語で返答してください。
`.trim();

  const formattedContents = formatConversationForGemini(conversation);

  // List of candidate models to try (primary chosen model first, then fallback models if 404 occurs)
  const candidateModels = Array.from(
    new Set([configuredModel, 'gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'])
  );

  let lastErrorMsg = '';

  for (const modelToTry of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        modelToTry
      )}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

      // 1. Try standard request with system_instruction
      let res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstructionText }],
          },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
          },
        }),
      });

      // 2. If 400 Bad Request, retry by embedding system instructions into the first user turn
      if (res.status === 400) {
        const embeddedContents = formattedContents.map((c, idx) => {
          if (idx === 0) {
            return {
              role: c.role,
              parts: [{ text: `【設定指示】\n${systemInstructionText}\n\n【ユーザー発言】\n${c.parts[0].text}` }],
            };
          }
          return c;
        });

        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: embeddedContents,
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 500,
            },
          }),
        });
      }

      if (res.status === 404) {
        const errData = await res.json().catch(() => ({}));
        lastErrorMsg = errData.error?.message || `Model ${modelToTry} not found (404)`;
        console.warn(`Gemini model ${modelToTry} returned 404, attempting fallback...`);
        continue;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(`Gemini APIエラー: ${errMsg}`);
      }

      const data = await res.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText && replyText.trim()) {
        return {
          text: replyText.trim(),
          modelUsed: modelToTry,
          isAi: true,
        };
      }
    } catch (e: any) {
      if (e.message?.includes('Gemini APIエラー')) {
        throw e;
      }
      lastErrorMsg = e.message || String(e);
    }
  }

  throw new Error(`Gemini通信エラー: ${lastErrorMsg || 'すべてのモデル候補で通信に失敗しました。APIキーまたはモデル権限をご確認ください。'}`);
};
