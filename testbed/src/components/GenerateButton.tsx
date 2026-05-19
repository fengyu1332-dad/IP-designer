interface GenerateButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export function GenerateButton({
  disabled,
  isLoading,
  onClick,
}: GenerateButtonProps) {
  return (
    <section className="mb-12 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="group relative inline-flex items-center justify-center px-12 py-4 rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="absolute inset-[2px] bg-white rounded-[14px]"></div>
        <div className="relative flex items-center gap-2">
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-semibold text-indigo-600">
                生成中...
              </span>
            </>
          ) : (
            <>
              <span className="text-lg font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                ✨ 生成金句 & Prompt
              </span>
            </>
          )}
        </div>
      </button>
    </section>
  );
}
