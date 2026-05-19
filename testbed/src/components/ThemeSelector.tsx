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
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-lg">
          2
        </div>
        <h2 className="text-xl font-semibold text-slate-800">主题意图选择</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-100">
          {THEME_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onPrimaryThemeChange(category.name);
                onSecondaryThemeChange('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                primaryTheme === category.name
                  ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {activeCategory && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
              <h3 className="text-sm font-medium text-slate-700">细分选项</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {activeCategory.subThemes.map((subTheme) => (
                <button
                  key={subTheme}
                  onClick={() => onSecondaryThemeChange(subTheme)}
                  className={`p-4 rounded-xl text-left text-sm transition-all duration-200 border-2 ${
                    secondaryTheme === subTheme
                      ? 'bg-violet-50 border-violet-400 text-violet-700 shadow-sm'
                      : 'bg-slate-50 border-transparent text-slate-600 hover:border-violet-300 hover:bg-slate-100'
                  }`}
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
