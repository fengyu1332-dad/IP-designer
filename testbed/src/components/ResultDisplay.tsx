import { useState } from 'react';

interface ResultDisplayProps {
  quote: string | null;
  imagePrompt: string | null;
  imagePromptCn: string | null;
  onRegenerate: () => void;
  onShare: () => void;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

export function ResultDisplay({ quote, imagePrompt, imagePromptCn, onRegenerate, onShare }: ResultDisplayProps) {
  const [copied, setCopied] = useState<'quote' | 'prompt' | 'promptCn' | null>(null);

  const handleCopyQuote = async () => {
    if (!quote) return;
    const success = await copyToClipboard(quote);
    if (success) {
      setCopied('quote');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyPrompt = async () => {
    if (!imagePrompt) return;
    const success = await copyToClipboard(imagePrompt);
    if (success) {
      setCopied('prompt');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyPromptCn = async () => {
    if (!imagePromptCn) return;
    const success = await copyToClipboard(imagePromptCn);
    if (success) {
      setCopied('promptCn');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  if (!quote || !imagePrompt) return null;

  return (
    <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/30">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-slate-800">生成结果</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 card-hover">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-500">📝 金句</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onShare}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-sm text-indigo-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享
              </button>
              <button
                onClick={handleCopyQuote}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-sm text-slate-600 hover:text-indigo-600 transition-all duration-200"
              >
                {copied === 'quote' ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    已复制
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    复制
                  </>
                )}
              </button>
            </div>
          </div>
          <blockquote className="text-xl font-medium text-slate-800 leading-relaxed">
            "{quote}"
          </blockquote>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-900/20">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-400">🎨 英文 Prompt</span>
              </div>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-indigo-600 text-sm text-slate-200 transition-all duration-200"
            >
              {copied === 'prompt' ? (
                <>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </>
              )}
            </button>
          </div>
          <pre className="text-sm text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
            {imagePrompt}
          </pre>
        </div>

        {imagePromptCn && (
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-2xl p-6 shadow-xl shadow-indigo-900/20">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-300">🎨 中文 Prompt</span>
                </div>
              </div>
              <button
                onClick={handleCopyPromptCn}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-indigo-600 text-sm text-slate-200 transition-all duration-200"
              >
                {copied === 'promptCn' ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    已复制
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    复制
                  </>
                )}
              </button>
            </div>
            <pre className="text-sm text-amber-200 font-mono leading-relaxed whitespace-pre-wrap break-all">
              {imagePromptCn}
            </pre>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onRegenerate}
            className="tag inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all duration-200 shadow-sm border border-slate-200/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">重新生成</span>
          </button>
        </div>
      </div>
    </section>
  );
}