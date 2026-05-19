import { WEATHER_OPTIONS, MOOD_OPTIONS } from '../constants/themes';
import { CustomInput } from './CustomInput';

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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
          1
        </div>
        <h2 className="text-xl font-semibold text-slate-800">环境参数配置</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 card-hover">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            天气 / 光影
          </label>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                onClick={() => onWeatherChange(option.value)}
                className={`tag px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 ${
                  weather === option.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400 hover:bg-slate-100'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <CustomInput
            placeholder="输入自定义天气描述，如：夕阳余晖、雷电交加..."
            value={weather}
            onChange={onWeatherChange}
            icon="☀️"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 card-hover">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            当前情绪
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                onClick={() => onMoodChange(option.value)}
                className={`tag px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 ${
                  mood === option.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400 hover:bg-slate-100'
                }`}
                style={{
                  animationDelay: `${(index + 6) * 50}ms`,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <CustomInput
            placeholder="输入自定义情绪描述，如：兴奋期待、淡淡忧伤..."
            value={mood}
            onChange={onMoodChange}
            icon="💭"
          />
        </div>
      </div>
    </section>
  );
}
