import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { GenerateButton } from './components/GenerateButton';
import { ResultDisplay } from './components/ResultDisplay';
import { useLLM } from './hooks/useLLM';
import { useLocalStorage } from './hooks/useLocalStorage';

const SYSTEM_PROMPT = `你是一个专业的创意文案生成助手。

你的任务是：根据用户提供的环境参数（天气光影、情绪状态）和主题意图，生成一句富有诗意和意境的金句。

要求：
1. 金句要简洁优美，富有感染力
2. 结合天气光影和情绪状态营造氛围
3. 语言风格要符合主题意图的调性
4. 输出格式：只输出金句内容，不要包含其他解释性文字

例子：
- 天气：晴天，情绪：平静，主题：创意设计
  输出：阳光穿过指尖，灵感如金粉般洒落
  
- 天气：日落，情绪：放松，主题：生活助手
  输出：夕阳把影子拉得很长，烦恼在暮色中融化`;

export default function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('anthropic-api-key', '');
  const [weather, setWeather] = useState('sunny');
  const [mood, setMood] = useState('calm');
  const [category, setCategory] = useState('creative');
  const [subcategory, setSubcategory] = useState('');
  const [quote, setQuote] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);

  const { isLoading, error, response, sendMessage } = useLLM(apiKey, SYSTEM_PROMPT);

  useEffect(() => {
    if (response) {
      setQuote(response.content.trim());
      setShowResult(true);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      alert(`生成失败：${error.message}`);
    }
  }, [error]);

  const generatePrompt = () => {
    const weatherLabels: Record<string, string> = {
      sunny: '晴天',
      cloudy: '多云',
      rainy: '雨天',
      sunset: '日落',
      night: '夜晚',
    };

    const moodLabels: Record<string, string> = {
      calm: '平静',
      happy: '愉悦',
      focused: '专注',
      creative: '创意',
      relaxed: '放松',
    };

    const categoryLabels: Record<string, string> = {
      creative: '创意设计',
      writing: '文案写作',
      coding: '编程开发',
      marketing: '市场营销',
      education: '教育培训',
      life: '生活助手',
    };

    let prompt = `根据以下参数生成一句金句：\n\n`;
    prompt += `天气光影：${weatherLabels[weather]}\n`;
    prompt += `情绪状态：${moodLabels[mood]}\n`;
    prompt += `主题意图：${categoryLabels[category]}`;
    
    if (subcategory) {
      prompt += ` - ${subcategory}`;
    }

    return prompt;
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      alert('请先配置 API Key');
      return;
    }

    const prompt = generatePrompt();
    setGeneratedPrompt(prompt);
    setShowResult(false);
    setQuote('');

    await sendMessage(prompt);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnvironmentSelector
            weather={weather}
            mood={mood}
            onWeatherChange={setWeather}
            onMoodChange={setMood}
          />

          <ThemeSelector
            category={category}
            subcategory={subcategory}
            onCategoryChange={setCategory}
            onSubcategoryChange={setSubcategory}
          />
        </div>

        <div className="flex justify-center">
          <GenerateButton
            onClick={handleGenerate}
            loading={isLoading}
            disabled={!apiKey}
          >
            {isLoading ? '生成中...' : '生成金句'}
          </GenerateButton>
        </div>

        {showResult && quote && (
          <ResultDisplay
            quote={quote}
            prompt={generatedPrompt}
            onRegenerate={handleRegenerate}
          />
        )}

        {!showResult && !isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              选择参数生成专属金句
            </h3>
            <p className="text-gray-500">
              设置天气光影、情绪状态和主题意图，AI 将为您生成独特的灵感语录
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6 animate-pulse">
              <svg
                className="w-8 h-8 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-gray-600">AI 正在为您生成金句...</p>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-sm text-gray-400">
        <p>Powered by Anthropic Claude</p>
      </footer>
    </div>
  );
}
