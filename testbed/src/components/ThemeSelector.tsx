import { THEME_CATEGORIES } from '../constants/themes';

interface ThemeSelectorProps {
  primaryTheme: string | null;
  secondaryTheme: string | null;
  onPrimaryThemeChange: (value: string) => void;
  onSecondaryThemeChange: (value: string) => void;
}

export function ThemeSelector({
  primaryTheme,
  secondaryTheme,
  onPrimaryThemeChange,
  onSecondaryThemeChange,
}: ThemeSelectorProps) {
  const activeCategory = primaryTheme
    ? THEME_CATEGORIES.find((t) => t.name === primaryTheme)
    : null;

  return (
    <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
          2
        </div>
        <h2 className="text-xl font-semibold text-slate-800">主题意图选择</h2>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 card-hover">
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200/50">
          {THEME_CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                onPrimaryThemeChange(category.name);
                onSecondaryThemeChange('');
              }}
              className={`tag px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                primaryTheme === category.name
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              style={{
                animationDelay: `${(index + 12) * 50}ms`,
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {activeCategory && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
              <h3 className="text-sm font-medium text-slate-700">细分选项</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activeCategory.subThemes.map((subTheme, index) => (
                <button
                  key={subTheme}
                  onClick={() => onSecondaryThemeChange(subTheme)}
                  className={`tag p-4 rounded-xl text-left text-sm transition-all duration-200 border-2 ${
                    secondaryTheme === subTheme
                      ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-400 text-indigo-700 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 border-transparent text-slate-600 hover:border-indigo-300 hover:bg-slate-100'
                  }`}
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  {subTheme}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
