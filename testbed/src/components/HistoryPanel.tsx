import { useState } from 'react';
import type { HistoryItem } from '../types';
import { formatTimestamp } from '../types';
import { Analytics } from './Analytics';

interface HistoryPanelProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ isOpen, history, onClose, onSelect, onDelete, onClear }: HistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'analytics'>('history');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] shadow-2xl animate-slide-up flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('history')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'history' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              历史记录
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              统计数据
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'history' ? (
            history.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">暂无历史记录</p>
                  <p className="text-sm text-slate-400 mt-1">生成的内容会显示在这里</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                            {item.primaryTheme}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium line-clamp-2">"{item.quote}"</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">
                          {item.imagePrompt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onSelect(item)}
                          className="w-8 h-8 rounded-lg hover:bg-indigo-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                          title="查看详情"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center text-slate-500 hover:text-red-600 transition-colors"
                          title="删除"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <Analytics />
          )}
        </div>

        {history.length > 0 && activeTab === 'history' && (
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={onClear}
              className="w-full px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium"
            >
              清空历史记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
