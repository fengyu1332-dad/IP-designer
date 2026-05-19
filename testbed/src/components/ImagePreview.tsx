import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ImagePreviewProps {
  prompt: string;
  aspectRatio: string;
}

interface GenerationResult {
  id: string;
  imageUrl: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
}

export function ImagePreview({ prompt, aspectRatio }: ImagePreviewProps) {
  const [sdApiKey] = useLocalStorage<string>('ip-designer-sd-api-key', '');
  const [sdApiBase] = useLocalStorage<string>('ip-designer-sd-api-base', 'https://api.stability.ai/v1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const aspectRatioToSize = (ratio: string) => {
    switch (ratio) {
      case '3:4': return { width: 768, height: 1024 };
      case '16:9': return { width: 1344, height: 756 };
      case '1:1': return { width: 1024, height: 1024 };
      case '9:16': return { width: 768, height: 1344 };
      case '4:3': return { width: 1024, height: 768 };
      default: return { width: 1024, height: 1024 };
    }
  };

  const generateImage = async () => {
    if (!sdApiKey) {
      setError('请先在设置中配置 Stable Diffusion API Key');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults([{ id: '1', imageUrl: '', status: 'loading' }]);

    const size = aspectRatioToSize(aspectRatio);

    try {
      const response = await fetch(`${sdApiBase}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sdApiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: size.height,
          width: size.width,
          steps: 30,
          samples: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const base64Image = data.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${base64Image}`;

      setResults([{ id: '1', imageUrl, status: 'success' }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成失败';
      setError(message);
      setResults([{ id: '1', imageUrl: '', status: 'error', error: message }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/30">
          🖼️
        </div>
        <h2 className="text-lg font-semibold text-slate-800">图片预览</h2>
        <button
          onClick={() => window.open('https://platform.stability.ai/', '_blank')}
          className="ml-auto text-xs text-slate-400 hover:text-slate-600"
        >
          获取 SD API Key →
        </button>
      </div>

      {!sdApiKey ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-500 mb-2">配置 Stable Diffusion API</p>
          <p className="text-sm text-slate-400">在设置中添加 SD API Key 即可生成图片</p>
        </div>
      ) : (
        <>
          <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
            {results.length === 0 || isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-500">正在生成图片...</p>
                </div>
              </div>
            ) : results[0].status === 'error' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-red-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>{error || '生成失败'}</p>
                </div>
              </div>
            ) : (
              <img
                src={results[0].imageUrl}
                alt="Generated"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <button
            onClick={generateImage}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isGenerating ? '生成中...' : '🎨 生成图片'}
          </button>

          {results.length > 0 && results[0].status === 'success' && (
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = results[0].imageUrl;
                link.download = `ip-designer-${Date.now()}.png`;
                link.click();
              }}
              className="w-full mt-2 py-2 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors"
            >
              ⬇️ 下载图片
            </button>
          )}
        </>
      )}
    </section>
  );
}
