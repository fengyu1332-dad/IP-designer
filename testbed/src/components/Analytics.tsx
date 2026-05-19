import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryItem } from '../types';

interface AnalyticsData {
  totalGenerations: number;
  primaryThemeCounts: Record<string, number>;
  weatherCounts: Record<string, number>;
  moodCounts: Record<string, number>;
}

export function Analytics() {
  const [history] = useLocalStorage<HistoryItem[]>('ip-designer-history', []);

  const computeAnalytics = (): AnalyticsData => {
    const analytics: AnalyticsData = {
      totalGenerations: history.length,
      primaryThemeCounts: {},
      weatherCounts: {},
      moodCounts: {},
    };

    history.forEach((item) => {
      analytics.primaryThemeCounts[item.primaryTheme] = (analytics.primaryThemeCounts[item.primaryTheme] || 0) + 1;
      analytics.weatherCounts[item.weather] = (analytics.weatherCounts[item.weather] || 0) + 1;
      analytics.moodCounts[item.mood] = (analytics.moodCounts[item.mood] || 0) + 1;
    });

    return analytics;
  };

  const analytics = computeAnalytics();

  const topThemes = Object.entries(analytics.primaryThemeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topWeather = Object.entries(analytics.weatherCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topMood = Object.entries(analytics.moodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{analytics.totalGenerations}</div>
          <div className="text-xs text-indigo-500">总生成数</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(analytics.primaryThemeCounts).length}
          </div>
          <div className="text-xs text-purple-500">使用主题</div>
        </div>
        <div className="bg-pink-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-pink-600">
            {history.length > 0 ? Math.ceil(history.length / 7) : 0}
          </div>
          <div className="text-xs text-pink-500">周均</div>
        </div>
      </div>

      {topThemes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-2">🔥 最爱主题</h4>
          <div className="space-y-2">
            {topThemes.map(([theme, count], index) => (
              <div key={theme} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-700 truncate">{theme}</div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(count / history.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-slate-500">{count}次</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topWeather.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-2">☁️ 常用天气</h4>
          <div className="flex gap-2 flex-wrap">
            {topWeather.map(([weather]) => (
              <span key={weather} className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-600">
                {weather}
              </span>
            ))}
          </div>
        </div>
      )}

      {topMood.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-2">💭 常用心情</h4>
          <div className="flex gap-2 flex-wrap">
            {topMood.map(([mood]) => (
              <span key={mood} className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-600">
                {mood}
              </span>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && (
        <div className="text-center py-4 text-slate-400 text-sm">
          开始生成内容后查看统计数据 📊
        </div>
      )}
    </div>
  );
}
