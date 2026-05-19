export interface HistoryItem {
  id: string;
  quote: string;
  imagePrompt: string;
  weather: string;
  mood: string;
  primaryTheme: string;
  secondaryTheme: string;
  timestamp: number;
}

export interface GenerationParams {
  date: string;
  weather: string;
  mood: string;
  primaryTheme: string;
  secondaryTheme: string;
}

export function createHistoryItem(
  params: GenerationParams,
  quote: string,
  imagePrompt: string
): HistoryItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    quote,
    imagePrompt,
    weather: params.weather,
    mood: params.mood,
    primaryTheme: params.primaryTheme,
    secondaryTheme: params.secondaryTheme,
    timestamp: Date.now(),
  };
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}
