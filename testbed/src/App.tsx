import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { GenerateButton } from './components/GenerateButton';
import { ResultDisplay } from './components/ResultDisplay';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HistoryPanel } from './components/HistoryPanel';
import { ToastContainer, useToast } from './components/Toast';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ImagePreview } from './components/ImagePreview';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLLM } from './hooks/useLLM';
import { createHistoryItem } from './types';
import type { HistoryItem, GenerationParams } from './types';

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[now.getDay()];
  return `${year}年${month}月${day}日 星期${weekDay}`;
}

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('ip-designer-api-key', '');
  const [apiBase, setApiBase] = useLocalStorage<string>('ip-designer-api-base', 'https://api.deepseek.com/v1');
  const [date] = useState<string>(getCurrentDate());
  const [aspectRatio, setAspectRatio] = useLocalStorage<string>('ip-designer-aspect-ratio', '3:4');

  const [weather, setWeather] = useLocalStorage<string | null>('ip-designer-weather', null);
  const [mood, setMood] = useLocalStorage<string | null>('ip-designer-mood', null);
  const [primaryTheme, setPrimaryTheme] = useLocalStorage<string | null>('ip-designer-primary-theme', null);
  const [secondaryTheme, setSecondaryTheme] = useLocalStorage<string | null>('ip-designer-secondary-theme', null);

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('ip-designer-history', []);
  const [showHistory, setShowHistory] = useState(false);
  const [currentParams, setCurrentParams] = useState<GenerationParams | null>(null);

  const { isLoading, error, quote, imagePrompt, generate } = useLLM();
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);
  const { toasts, addToast, removeToast } = useToast();

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!weather || !mood || !primaryTheme || !secondaryTheme) {
      return;
    }

    const params: GenerationParams = {
      date,
      weather,
      mood,
      primaryTheme,
      secondaryTheme,
    };
    setCurrentParams(params);

    await generate({
      date,
      weather,
      mood,
      primaryTheme,
      secondaryTheme,
      apiKey,
      apiBase,
      aspectRatio,
    });
  };

  useEffect(() => {
    if (quote && imagePrompt && currentParams) {
      const newItem = createHistoryItem(currentParams, quote, imagePrompt);
      setHistory((prev) => [newItem, ...prev].slice(0, 50));
    }
  }, [quote, imagePrompt]);

  const handleShare = async () => {
    if (!quote || !imagePrompt) return;
    
    const shareText = `📝 ${quote}\n\n🎨 AI Prompt:\n${imagePrompt}\n\n—— 由 IP Designer 生成`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      addToast('已复制到剪贴板', 'success');
    } catch {
      addToast('复制失败', 'error');
    }
  };

  const handleSaveApiSettings = (newApiKey: string, newApiBase: string) => {
    setApiKey(newApiKey);
    setApiBase(newApiBase);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setWeather(item.weather);
    setMood(item.mood);
    setPrimaryTheme(item.primaryTheme);
    setSecondaryTheme(item.secondaryTheme);
    setShowHistory(false);
    addToast('已加载历史记录', 'info');
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    addToast('已删除', 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    addToast('历史记录已清空', 'info');
  };

  const isGenerateDisabled = !weather || !mood || !primaryTheme || !secondaryTheme;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header
        date={date}
        onSettingsClick={() => setShowApiKeyModal(true)}
        onHistoryClick={() => setShowHistory(true)}
      />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <EnvironmentSelector
          weather={weather}
          mood={mood}
          onWeatherChange={setWeather}
          onMoodChange={setMood}
        />

        <ThemeSelector
          primaryTheme={primaryTheme}
          secondaryTheme={secondaryTheme}
          onPrimaryThemeChange={setPrimaryTheme}
          onSecondaryThemeChange={setSecondaryTheme}
        />

        <div className="mb-8 flex justify-center">
          <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
        </div>

        <GenerateButton
          disabled={isGenerateDisabled}
          isLoading={isLoading}
          onClick={handleGenerate}
        />

        <ResultDisplay
          quote={quote}
          imagePrompt={imagePrompt}
          onRegenerate={handleGenerate}
          onShare={handleShare}
        />

        {quote && imagePrompt && (
          <ImagePreview prompt={imagePrompt} aspectRatio={aspectRatio} />
        )}

        {error && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            {error}
          </div>
        )}
      </main>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        apiKey={apiKey}
        apiBase={apiBase}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiSettings}
      />

      <HistoryPanel
        isOpen={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
