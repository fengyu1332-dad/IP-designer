interface HeaderProps {
  date: string;
  onSettingsClick: () => void;
}

export function Header({ date, onSettingsClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
            IP
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">IP Designer</h1>
            <p className="text-xs text-slate-500">Prompt 自动化生成</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 bg-white/60 px-3 py-1.5 rounded-lg border border-slate-200/50">
            <span className="mr-1">📅</span> {date}
          </div>
          <button
            onClick={onSettingsClick}
            className="w-9 h-9 rounded-lg bg-white/60 hover:bg-indigo-50 flex items-center justify-center transition-colors border border-slate-200/50"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
