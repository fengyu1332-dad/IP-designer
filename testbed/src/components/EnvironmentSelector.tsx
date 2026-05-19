import { WEATHER_OPTIONS, MOOD_OPTIONS } from '../constants/themes';

interface EnvironmentSelectorProps {
  weather: string | null;
  mood: string | null;
  onWeatherChange: (value: string) => void;
  onMoodChange: (value: string) => void;
}

export function EnvironmentSelector({
  weather,
  mood,
  onWeatherChange,
  onMoodChange,
}: EnvironmentSelectorProps) {
  return (
    <section className="mb-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-lg">
          1
        </div>
        <h2 className="text-xl font-semibold text-slate-800">环境参数配置</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            天气 / 光影
          </label>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onWeatherChange(option.value)}
                className={`tag px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 ${
                  weather === option.value
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            当前情绪
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onMoodChange(option.value)}
                className={`tag px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 ${
                  mood === option.value
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
