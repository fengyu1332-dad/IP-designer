import { useState } from 'react';
import { Header } from './components/Header';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { GenerateButton } from './components/GenerateButton';
import { ResultDisplay } from './components/ResultDisplay';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLLM } from './hooks/useLLM';

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

  const [weather, setWeather] = useLocalStorage<string | null>('ip-designer-weather', null);
  const [mood, setMood] = useLocalStorage<string | null>('ip-designer-mood', null);
  const [primaryTheme, setPrimaryTheme] = useLocalStorage<string | null>('ip-designer-primary-theme', null);
  const [secondaryTheme, setSecondaryTheme] = useLocalStorage<string | null>('ip-designer-secondary-theme', null);

  const { isLoading, error, quote, imagePrompt, generate } = useLLM();
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!weather || !mood || !primaryTheme || !secondaryTheme) {
      return;
    }

    await generate({
      date,
      weather,
      mood,
      primaryTheme,
      secondaryTheme,
      apiKey,
      apiBase,
    });
  };

  const handleSaveApiSettings = (newApiKey: string, newApiBase: string) => {
    setApiKey(newApiKey);
    setApiBase(newApiBase);
  };

  const isGenerateDisabled = !weather || !mood || !primaryTheme || !secondaryTheme;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header
        date={date}
        onSettingsClick={() => setShowApiKeyModal(true)}
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

        <GenerateButton
          disabled={isGenerateDisabled}
          isLoading={isLoading}
          onClick={handleGenerate}
        />

        <ResultDisplay
          quote={quote}
          imagePrompt={imagePrompt}
          onRegenerate={handleGenerate}
        />

        {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
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
    </div>
  );
}

export default App;
