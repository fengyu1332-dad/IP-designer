import { useState } from 'react';

interface CustomInputProps {
  placeholder: string;
  value: string | null;
  onChange: (value: string) => void;
  icon?: string;
}

const CUSTOM_PATTERN = /^[☀️🌅🌧️🌫️🌙🌌😌💪🤔🙏😴🌿📸🎨🖌️✨🎬📻]/;

export function CustomInput({
  placeholder,
  value,
  onChange,
  icon = '✏️'
}: CustomInputProps) {
  const isCustomValue = value && !CUSTOM_PATTERN.test(value);
  
  const [internalValue, setInternalValue] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const displayValue = isCustomMode ? internalValue : (isCustomValue ? value : '');
  const showInput = isCustomMode || isCustomValue;

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    if (newValue.trim()) {
      onChange(newValue.trim());
    }
  };

  const handleBlur = () => {
    if (!internalValue.trim() && isCustomMode) {
      setIsCustomMode(false);
      onChange('');
    }
  };

  const handleToggle = () => {
    if (isCustomMode) {
      setIsCustomMode(false);
      setInternalValue('');
      if (!internalValue.trim()) {
        onChange('');
      }
    } else {
      setIsCustomMode(true);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">或自定义输入</span>
        <button
          onClick={handleToggle}
          className={`text-xs px-2 py-1 rounded-md transition-colors ${
            isCustomMode
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {isCustomMode ? '使用预设' : '自定义'}
        </button>
      </div>

      {showInput && (
        <div className="relative animate-slide-up">
          <input
            type="text"
            value={displayValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-300 bg-indigo-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg opacity-50">
            {icon}
          </span>
        </div>
      )}
    </div>
  );
}
