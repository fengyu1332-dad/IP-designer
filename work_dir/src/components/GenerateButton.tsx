interface GenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function GenerateButton({
  onClick,
  loading = false,
  disabled = false,
  children = '生成',
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        relative px-8 py-3.5 rounded-xl font-semibold text-white
        overflow-hidden transition-all duration-300
        ${loading || disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className="absolute inset-[1px] bg-white rounded-lg" />
      
      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <svg
            className="w-5 h-5 text-blue-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className="text-blue-600">{children}</span>
      </span>
    </button>
  );
}