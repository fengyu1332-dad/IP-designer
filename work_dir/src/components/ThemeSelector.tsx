import { useState } from 'react';

export interface ThemeSelectorProps {
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  category: string;
  subcategory: string;
}

const categoryOptions = [
  { id: 'creative', label: '创意设计', icon: '🎨' },
  { id: 'writing', label: '文案写作', icon: '✍️' },
  { id: 'coding', label: '编程开发', icon: '💻' },
  { id: 'marketing', label: '市场营销', icon: '📣' },
  { id: 'education', label: '教育培训', icon: '📚' },
  { id: 'life', label: '生活助手', icon: '🌟' },
];

const subcategoryOptions: Record<string, { id: string; label: string; icon: string }[]> = {
  creative: [
    { id: 'logo', label: 'Logo设计', icon: '🏷️' },
    { id: 'banner', label: '海报横幅', icon: '🖼️' },
    { id: 'ui', label: 'UI界面', icon: '📱' },
    { id: 'brand', label: '品牌VI', icon: '🎭' },
    { id: 'illustration', label: '插画设计', icon: '🖌️' },
    { id: 'packaging', label: '包装设计', icon: '📦' },
  ],
  writing: [
    { id: 'article', label: '文章撰写', icon: '📝' },
    { id: 'copywriting', label: '广告文案', icon: '📢' },
    { id: 'email', label: '邮件写作', icon: '📧' },
    { id: 'story', label: '故事创作', icon: '📖' },
    { id: 'summary', label: '摘要总结', icon: '📋' },
    { id: 'poem', label: '诗歌创作', icon: '🎵' },
  ],
  coding: [
    { id: 'web', label: '网站开发', icon: '🌐' },
    { id: 'mobile', label: '移动应用', icon: '📱' },
    { id: 'api', label: 'API开发', icon: '🔌' },
    { id: 'debug', label: '代码调试', icon: '🔧' },
    { id: 'review', label: '代码审查', icon: '🔍' },
    { id: 'automation', label: '自动化脚本', icon: '🤖' },
  ],
  marketing: [
    { id: 'plan', label: '营销策划', icon: '📊' },
    { id: 'social', label: '社交媒体', icon: '💬' },
    { id: 'seo', label: 'SEO优化', icon: '🔍' },
    { id: 'ad', label: '广告投放', icon: '🎯' },
    { id: 'analysis', label: '数据分析', icon: '📈' },
    { id: 'content', label: '内容运营', icon: '📰' },
  ],
  education: [
    { id: 'course', label: '课程设计', icon: '📚' },
    { id: 'exam', label: '考试辅导', icon: '✏️' },
    { id: 'language', label: '语言学习', icon: '🌍' },
    { id: 'tutorial', label: '教程编写', icon: '📖' },
    { id: 'research', label: '学术研究', icon: '🔬' },
    { id: 'mentor', label: '职业辅导', icon: '👨‍🏫' },
  ],
  life: [
    { id: 'recipe', label: '美食菜谱', icon: '🍳' },
    { id: 'travel', label: '旅行规划', icon: '✈️' },
    { id: 'health', label: '健康养生', icon: '💪' },
    { id: 'finance', label: '理财规划', icon: '💰' },
    { id: 'gift', label: '礼物推荐', icon: '🎁' },
    { id: 'advice', label: '生活建议', icon: '💡' },
  ],
};

export function ThemeSelector({
  onCategoryChange,
  onSubcategoryChange,
  category,
  subcategory,
}: ThemeSelectorProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const currentSubcategories = subcategoryOptions[category] || [];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">主题意图</h2>
          <p className="text-xs text-gray-500">选择您的需求分类</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categoryOptions.map((cat) => {
            const isSelected = category === cat.id;
            const isHovered = hoveredCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  onSubcategoryChange('');
                }}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-300 ease-out
                  ${isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  ${isHovered && !isSelected ? 'scale-102' : ''}
                  hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50
                `}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5" />

      <div>
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
          细分选项
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {currentSubcategories.map((sub) => {
            const isSelected = subcategory === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => onSubcategoryChange(sub.id)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl
                  transition-all duration-300 ease-out
                  ${isSelected
                    ? 'bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-400 text-purple-700 shadow-md shadow-purple-200'
                    : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-200'
                  }
                  hover:scale-102
                  focus:outline-none focus:ring-2 focus:ring-purple-500/30
                `}
              >
                <span className="text-xl">{sub.icon}</span>
                <span className="text-xs font-medium">{sub.label}</span>
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-600 bg-white rounded-full p-0.5 shadow-sm"
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
    </div>
  );
}