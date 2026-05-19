import { IMAGE_STYLE_OPTIONS } from '../constants/themes';

interface ImageStyleSelectorProps {
  imageStyle: string | null;
  onChange: (value: string) => void;
}

export function ImageStyleSelector({ imageStyle, onChange }: ImageStyleSelectorProps) {
  return (
    <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-amber-500/30">
          3
        </div>
        <h2 className="text-xl font-semibold text-slate-800">图片风格选择</h2>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 card-hover">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          选择图片风格（适合朋友圈分享）
        </label>
        <div className="flex flex-wrap gap-2">
          {IMAGE_STYLE_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`tag px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 ${
                imageStyle === option.value
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent shadow-lg shadow-amber-500/30'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-400 hover:bg-slate-100'
              }`}
              style={{
                animationDelay: `${(index + 12) * 50}ms`,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}