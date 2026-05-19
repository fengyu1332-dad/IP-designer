import { useState } from 'react';

export interface EnvironmentSelectorProps {
  onWeatherChange: (weather: string) => void;
  onMoodChange: (mood: string) => void;
  weather: string;
  mood: string;
}

const weatherOptions = [
  { id: 'sunny', label: '晴天', icon: '☀️' },
  { id: 'cloudy', label: '多云', icon: '☁️' },
  { id: 'rainy', label: '雨天', icon: '🌧️' },
  { id: 'sunset', label: '日落', icon: '🌅' },
  { id: 'night', label: '夜晚', icon: '🌙' },
];

const moodOptions = [
  { id: 'calm', label: '平静', icon: '😌' },
  { id: 'happy', label: '愉悦', icon: '😊' },
  { id: 'focused', label: '专注', icon: '🎯' },
  { id: 'creative', label: '创意', icon: '💡' },
  { id: 'relaxed', label: '放松', icon: '🛋️' },
];

export function EnvironmentSelector({
  onWeatherChange,
  onMoodChange,
  weather,
  mood,
}: EnvironmentSelectorProps) {
  const [hoveredWeather, setHoveredWeather] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const gradientColors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-emerald-500 to-teal-400',
    'from-orange-500 to-yellow-400',
    'from-indigo-600 to-purple-500',
  ];

  const getGradient = (index: number) => gradientColors[index % gradientColors.length];

  const renderOption = (
    options: typeof weatherOptions,
    selected: string,
    hovered: string | null,
    onSelect: (value: string) => void,
    onHover: (value: string | null) => void,
    title: string
  ) => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected = selected === option.id;
          const isHovered = hovered === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              onMouseEnter={() => onHover(option.id)}
              onMouseLeave={() => onHover(null)}
              className={`
                relative px-4 py-2.5 rounded-xl font-medium text-sm
                transition-all duration-300 ease-out
                ${isSelected
                  ? `bg-gradient-to-r ${getGradient(index)} text-white shadow-lg shadow-blue-500/30 scale-105`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
                ${isHovered && !isSelected ? 'scale-102' : ''}
                hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-lg transition-transform duration-300">
                  {option.icon}
                </span>
                <span>{option.label}</span>
              </span>
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">环境参数</h2>
          <p className="text-xs text-gray-500">设置天气光影与情绪状态</p>
        </div>
      </div>

      <div className="space-y-6">
        {renderOption(
          weatherOptions,
          weather,
          hoveredWeather,
          onWeatherChange,
          setHoveredWeather,
          '天气/光影'
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {renderOption(
          moodOptions,
          mood,
          hoveredMood,
          onMoodChange,
          setHoveredMood,
          '情绪状态'
        )}
      </div>
    </div>
  );
}
