interface AspectRatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ASPECT_RATIOS = [
  { value: '3:4', label: '3:4', description: '竖版人像' },
  { value: '16:9', label: '16:9', description: '横版风景' },
  { value: '1:1', label: '1:1', description: '方形' },
  { value: '9:16', label: '9:16', description: '手机竖屏' },
  { value: '4:3', label: '4:3', description: '经典比例' },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">画面比例：</span>
      <div className="flex gap-1">
        {ASPECT_RATIOS.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onChange(ratio.value)}
            className={`tag px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              value === ratio.value
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title={ratio.description}
          >
            {ratio.label}
          </button>
        ))}
      </div>
    </div>
  );
}
