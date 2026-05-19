# IP Designer Prompt Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React-based single-page application that generates Chinese quotes and Midjourney-style prompts from user-selected parameters, with direct LLM API integration.

**Architecture:** Single-page React app with modular components, state managed via React hooks, LLM calls from the browser via API keys stored locally.

**Tech Stack:** React 18 + Vite + Tailwind CSS + localStorage

---

## File Structure

```
/workspace/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Header.tsx          # Top header with date and settings
│   │   ├── EnvironmentSelector.tsx  # Weather & mood selection
│   │   ├── ThemeSelector.tsx  # Primary/secondary theme choice
│   │   ├── GenerateButton.tsx # Generate call-to-action
│   │   ├── ResultDisplay.tsx  # Quote + Prompt display
│   │   └── ApiKeyModal.tsx    # API key configuration
│   ├── hooks/
│   │   ├── useLocalStorage.ts # localStorage hook
│   │   └── useLLM.ts          # LLM API call hook
│   ├── constants/
│   │   └── themes.ts          # Theme data
│   ├── utils/
│   │   └── llm.ts             # LLM prompt construction
│   └── types/
│       └── index.ts           # TypeScript types
└── docs/
    └── superpowers/
        ├── specs/
        └── plans/
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Initialize Vite + React + TypeScript project**

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configure Tailwind CSS**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Update index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IP Designer - Prompt Generator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create main.tsx with base styles**

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  @apply bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen;
}

.tag {
  @apply transition-all duration-200;
}

.tag:hover {
  @apply -translate-y-0.5;
}

.tag.selected {
  @apply bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent;
}
```

- [ ] **Step 5: Verify project runs**

```bash
npm run dev
```

- [ ] **Step 6: Commit initialization**

```bash
git init
git add package.json vite.config.ts tailwind.config.js postcss.config.js index.html src/
git commit -m "feat: initialize project with Vite + React + Tailwind"
```

---

## Task 2: Type Definitions & Theme Constants

**Files:**
- Create: `src/types/index.ts`
- Create: `src/constants/themes.ts`

- [ ] **Step 1: Define TypeScript types**

```typescript
// src/types/index.ts
export interface AppState {
  date: string;
  weather: string | null;
  mood: string | null;
  primaryTheme: string | null;
  secondaryTheme: string | null;
  quote: string | null;
  prompt: string | null;
  isLoading: boolean;
  showApiKeyModal: boolean;
}

export interface Theme {
  name: string;
  subThemes: string[];
}

export interface LLMResponse {
  quote: string;
  image_prompt: string;
}
```

- [ ] **Step 2: Define theme constants**

```typescript
// src/constants/themes.ts
import type { Theme } from '../types';

export const WEATHER_OPTIONS = [
  { label: '☀️ 晴天', value: '晴天' },
  { label: '🌅 晨光', value: '晨光' },
  { label: '🌧️ 阴雨', value: '阴雨' },
  { label: '🌫️ 大雾', value: '大雾' },
  { label: '🌙 暮色', value: '暮色' },
  { label: '🌌 星空', value: '星空' },
];

export const MOOD_OPTIONS = [
  { label: '😌 平静', value: '平静' },
  { label: '💪 充满干劲', value: '充满干劲' },
  { label: '🤔 焦虑反思', value: '焦虑反思' },
  { label: '🙏 感恩', value: '感恩' },
  { label: '😴 疲惫但充实', value: '疲惫但充实' },
  { label: '🌿 松弛感', value: '松弛感' },
];

export const THEMES: Record<string, Theme> = {
  '职业信念与长期主义': {
    name: '职业信念与长期主义',
    subThemes: [
      '晨光中提包前行的背影',
      '深夜复盘的办公桌',
      '行业大会上专注听讲的侧影',
      '多年与客户的合影对比',
      '被反复修改的商业计划书',
      '解决复杂技术难题的草稿',
    ],
  },
  '硬核爱好与探索': {
    name: '硬核爱好与探索',
    subThemes: [
      '户外生存技能训练',
      'AI/编程工具逆向分析',
      '长跑配速与GPS轨迹',
      '深潜气瓶与浮力配平',
      '桥牌/德扑战术复盘',
      '健身PR记录与生理指标',
    ],
  },
  '家庭责任与陪伴': {
    name: '家庭责任与陪伴',
    subThemes: [
      '升学路径规划研究',
      '亲子户外挑战',
      '家庭共建日常',
      '睡前高质量陪伴',
      '辅导孩子功课的瞬间',
      '家庭宠物陪伴场景',
    ],
  },
  '日常烟火与碎片': {
    name: '日常烟火与碎片',
    subThemes: [
      '街头的流浪猫狗',
      '搞砸的料理',
      '意外的阵雨',
      '深夜空荡的街道',
      '路边咖啡馆',
      '一份用心制作的早餐',
    ],
  },
  '认知觉醒与感悟': {
    name: '认知觉醒与感悟',
    subThemes: [
      '商业系统逻辑重构',
      '经典书籍划线页',
      '旷野与天空的留白',
      '手绘思维导图草稿',
      '对热点事件的反思记录',
      '偶然发现的励志名言书法',
    ],
  },
  '人文关怀与共情': {
    name: '人文关怀与共情',
    subThemes: [
      '适老化科技普及场景',
      '街头老手艺人',
      '社区邻里互助',
      '义工活动服务场景',
      '公共交通上的温暖让座',
      '偏远山区儿童的眼神特写',
    ],
  },
};

export const PRIMARY_THEMES = Object.keys(THEMES);
```

- [ ] **Step 3: Commit types and constants**

```bash
git add src/types/index.ts src/constants/themes.ts
git commit -m "feat: add type definitions and theme constants"
```

---

## Task 3: Custom Hooks

**Files:**
- Create: `src/hooks/useLocalStorage.ts`
- Create: `src/utils/llm.ts`
- Create: `src/hooks/useLLM.ts`

- [ ] **Step 1: Implement useLocalStorage hook**

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

- [ ] **Step 2: Implement LLM prompt construction**

```typescript
// src/utils/llm.ts
export function buildSystemPrompt() {
  return `# Role
你是一个顶级的社交媒体内容总监与 AI 视觉提示词（Prompt）专家。

# Objective
根据用户提供的环境参数和特定主题，创作一句极具共情力、适合作为配图文字的中文金句，并配套生成一段极其专业、细节丰富的英文 AI 绘图 Prompt。

# Input Parameters
- 日期/节气：{Date}
- 天气/光影：{Weather}
- 当前情绪：{Mood}
- 核心主题：{Category} -> {Sub-option}

# Workflow
1. 分析输入参数，寻找环境、情绪与核心主题之间的内在联系与张力。
2. 撰写中文金句：字数限制在 15-30 字。风格需深刻、克制、真实。如果是专业信念，需体现契约精神；如果是硬核爱好或教育规划，需体现探索与严谨；如果是人文关怀，需体现科技与人性的温度。
3. 构建英文 Prompt：
   - 必须使用英文
   - 结构需包含：主体描述（极度具体）、背景环境、光影设置（如 Cinematic lighting, volumetric light）、摄影机视角（如 50mm lens, depth of field）、画面风格（如 photorealistic, documentary style, minimalist）
   - 避免直接将中文金句翻译成英文，而是要描绘金句所传达的视觉意象
   - 结尾默认加上宽高比参数，例如 --ar 3:4 或 --ar 16:9

# Output Format (Strict JSON)
{
  "quote": "生成的中文金句",
  "image_prompt": "生成的英文绘图 Prompt"
}`;
}

export function buildUserPrompt(params: {
  date: string;
  weather: string;
  mood: string;
  primaryTheme: string;
  secondaryTheme: string;
}) {
  return `日期/节气：${params.date}
天气/光影：${params.weather}
当前情绪：${params.mood}
核心主题：${params.primaryTheme} -> ${params.secondaryTheme}`;
}

export async function callLLM(
  apiKey: string,
  apiBase: string,
  systemPrompt: string,
  userPrompt: string
): Promise<{ quote: string; image_prompt: string }> {
  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}
```

- [ ] **Step 3: Implement useLLM hook**

```typescript
// src/hooks/useLLM.ts
import { useState } from 'react';
import { buildSystemPrompt, buildUserPrompt, callLLM } from '../utils/llm';

export function useLLM() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (params: {
    date: string;
    weather: string;
    mood: string;
    primaryTheme: string;
    secondaryTheme: string;
    apiKey: string;
    apiBase: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserPrompt(params);
      const result = await callLLM(params.apiKey, params.apiBase, systemPrompt, userPrompt);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, isLoading, error };
}
```

- [ ] **Step 4: Commit hooks and utils**

```bash
git add src/hooks/useLocalStorage.ts src/utils/llm.ts src/hooks/useLLM.ts
git commit -m "feat: add localStorage and LLM hooks"
```

---

## Task 4: Header Component

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Implement Header component**

```tsx
// src/components/Header.tsx
interface HeaderProps {
  date: string;
  onSettingsClick: () => void;
}

export function Header({ date, onSettingsClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            IP
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">IP Designer</h1>
            <p className="text-xs text-slate-500">Prompt 自动化生成</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">📅</span> {date}
          </div>
          <button
            onClick={onSettingsClick}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
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
```

- [ ] **Step 2: Commit Header component**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header component"
```

---

## Task 5: Environment Selector Component

**Files:**
- Create: `src/components/EnvironmentSelector.tsx`

- [ ] **Step 1: Implement EnvironmentSelector component**

```tsx
// src/components/EnvironmentSelector.tsx
import { WEATHER_OPTIONS, MOOD_OPTIONS } from '../constants/themes';

interface EnvironmentSelectorProps {
  weather: string | null;
  mood: string | null;
  onWeatherChange: (value: string) => void;
  onMoodChange: (value: string) => void;
}

export function EnvironmentSelector({ weather, mood, onWeatherChange, onMoodChange }: EnvironmentSelectorProps) {
  return (
    <section className="mb-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-lg">
          1
        </div>
        <h2 className="text-xl font-semibold text-slate-800">环境参数配置</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-3">天气 / 光影</label>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onWeatherChange(option.value)}
                className={`tag px-4 py-2 rounded-xl text-sm border ${
                  weather === option.value
                    ? 'selected'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-3">当前情绪</label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onMoodChange(option.value)}
                className={`tag px-4 py-2 rounded-xl text-sm border ${
                  mood === option.value
                    ? 'selected'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit EnvironmentSelector component**

```bash
git add src/components/EnvironmentSelector.tsx
git commit -m "feat: add EnvironmentSelector component"
```

---

## Task 6: Theme Selector Component

**Files:**
- Create: `src/components/ThemeSelector.tsx`

- [ ] **Step 1: Implement ThemeSelector component**

```tsx
// src/components/ThemeSelector.tsx
import { THEMES, PRIMARY_THEMES } from '../constants/themes';

interface ThemeSelectorProps {
  primaryTheme: string | null;
  secondaryTheme: string | null;
  onPrimaryThemeChange: (value: string) => void;
  onSecondaryThemeChange: (value: string) => void;
}

export function ThemeSelector({ primaryTheme, secondaryTheme, onPrimaryThemeChange, onSecondaryThemeChange }: ThemeSelectorProps) {
  const activeTheme = primaryTheme ? THEMES[primaryTheme] : null;

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
          {PRIMARY_THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => onPrimaryThemeChange(theme)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                primaryTheme === theme
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {activeTheme && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activeTheme.subThemes.map((subTheme) => (
              <button
                key={subTheme}
                onClick={() => onSecondaryThemeChange(subTheme)}
                className={`p-4 rounded-xl text-left transition-all border-2 ${
                  secondaryTheme === subTheme
                    ? 'bg-violet-50 border-violet-400'
                    : 'bg-slate-50 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}
              >
                <span className={`text-sm ${secondaryTheme === subTheme ? 'text-violet-700 font-medium' : 'text-slate-700'}`}>
                  {subTheme}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit ThemeSelector component**

```bash
git add src/components/ThemeSelector.tsx
git commit -m "feat: add ThemeSelector component"
```

---

## Task 7: Generate Button & Result Display Components

**Files:**
- Create: `src/components/GenerateButton.tsx`
- Create: `src/components/ResultDisplay.tsx`

- [ ] **Step 1: Implement GenerateButton component**

```tsx
// src/components/GenerateButton.tsx
interface GenerateButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export function GenerateButton({ disabled, isLoading, onClick }: GenerateButtonProps) {
  return (
    <section className="mb-12 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="relative inline-flex items-center justify-center px-12 py-4 rounded-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600"></div>
        <div className="absolute inset-[2px] bg-white rounded-[14px]"></div>
        <div className="relative flex items-center gap-2">
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                生成中...
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              ✨ 生成金句 & Prompt
            </span>
          )}
        </div>
      </button>
    </section>
  );
}
```

- [ ] **Step 2: Implement ResultDisplay component**

```tsx
// src/components/ResultDisplay.tsx
interface ResultDisplayProps {
  quote: string | null;
  prompt: string | null;
  onRegenerate: () => void;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert('已复制到剪贴板！');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

export function ResultDisplay({ quote, prompt, onRegenerate }: ResultDisplayProps) {
  if (!quote || !prompt) return null;

  return (
    <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium shadow-lg">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-slate-800">生成结果</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">📝 金句</span>
            <button
              onClick={() => copyToClipboard(quote)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </button>
          </div>
          <blockquote className="text-xl font-medium text-slate-800 leading-relaxed">
            "{quote}"
          </blockquote>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">🎨 AI Prompt</span>
            <button
              onClick={() => copyToClipboard(prompt)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </button>
          </div>
          <pre className="text-sm text-emerald-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {prompt}
          </pre>
        </div>

        <div className="text-center">
          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">重新生成</span>
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit components**

```bash
git add src/components/GenerateButton.tsx src/components/ResultDisplay.tsx
git commit -m "feat: add GenerateButton and ResultDisplay components"
```

---

## Task 8: API Key Modal Component

**Files:**
- Create: `src/components/ApiKeyModal.tsx`

- [ ] **Step 1: Implement ApiKeyModal component**

```tsx
// src/components/ApiKeyModal.tsx
interface ApiKeyModalProps {
  isOpen: boolean;
  apiKey: string;
  apiBase: string;
  onClose: () => void;
  onSave: (apiKey: string, apiBase: string) => void;
}

export function ApiKeyModal({ isOpen, apiKey, apiBase, onClose, onSave }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = React.useState(apiKey);
  const [baseInput, setBaseInput] = React.useState(apiBase);

  React.useEffect(() => {
    setKeyInput(apiKey);
    setBaseInput(apiBase);
  }, [apiKey, apiBase]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(keyInput, baseInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">API 设置</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">API Base URL</label>
            <input
              type="text"
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit ApiKeyModal component**

```bash
git add src/components/ApiKeyModal.tsx
git commit -m "feat: add ApiKeyModal component"
```

---

## Task 9: Main App Component

**Files:**
- Create: `src/App.tsx`

- [ ] **Step 1: Implement App component**

```tsx
// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { GenerateButton } from './components/GenerateButton';
import { ResultDisplay } from './components/ResultDisplay';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLLM } from './hooks/useLLM';
import type { AppState } from './types';

function getCurrentDate() {
  const now = new Date();
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${days[now.getDay()]}`;
}

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('ip-designer-api-key', '');
  const [apiBase, setApiBase] = useLocalStorage<string>('ip-designer-api-base', 'https://api.openai.com/v1');
  const [state, setState] = useState<AppState>({
    date: getCurrentDate(),
    weather: null,
    mood: null,
    primaryTheme: null,
    secondaryTheme: null,
    quote: null,
    prompt: null,
    isLoading: false,
    showApiKeyModal: !apiKey,
  });

  const { generate, isLoading, error } = useLLM();

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleGenerate = async () => {
    if (!state.weather || !state.mood || !state.primaryTheme || !state.secondaryTheme) {
      return;
    }

    if (!apiKey) {
      updateState({ showApiKeyModal: true });
      return;
    }

    updateState({ isLoading: true });

    try {
      const result = await generate({
        date: state.date,
        weather: state.weather,
        mood: state.mood,
        primaryTheme: state.primaryTheme,
        secondaryTheme: state.secondaryTheme,
        apiKey,
        apiBase,
      });

      updateState({
        quote: result.quote,
        prompt: result.image_prompt,
        isLoading: false,
      });
    } catch (err) {
      console.error('Generation failed:', err);
      updateState({ isLoading: false });
    }
  };

  const handleSaveApiSettings = (newKey: string, newBase: string) => {
    setApiKey(newKey);
    setApiBase(newBase);
  };

  const isGenerateDisabled = !state.weather || !state.mood || !state.primaryTheme || !state.secondaryTheme;

  return (
    <div className="min-h-screen">
      <Header
        date={state.date}
        onSettingsClick={() => updateState({ showApiKeyModal: true })}
      />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <EnvironmentSelector
          weather={state.weather}
          mood={state.mood}
          onWeatherChange={(w) => updateState({ weather: w })}
          onMoodChange={(m) => updateState({ mood: m })}
        />

        <ThemeSelector
          primaryTheme={state.primaryTheme}
          secondaryTheme={state.secondaryTheme}
          onPrimaryThemeChange={(t) => updateState({ primaryTheme: t, secondaryTheme: null })}
          onSecondaryThemeChange={(t) => updateState({ secondaryTheme: t })}
        />

        <GenerateButton
          disabled={isGenerateDisabled}
          isLoading={isLoading}
          onClick={handleGenerate}
        />

        <ResultDisplay
          quote={state.quote}
          prompt={state.prompt}
          onRegenerate={handleGenerate}
        />
      </main>

      <ApiKeyModal
        isOpen={state.showApiKeyModal}
        apiKey={apiKey}
        apiBase={apiBase}
        onClose={() => updateState({ showApiKeyModal: false })}
        onSave={handleSaveApiSettings}
      />

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Commit App component**

```bash
git add src/App.tsx
git commit -m "feat: implement main App component"
```

---

## Task 10: Final Build & Verification

**Files:**
- Modify: `package.json` (add build script if missing)

- [ ] **Step 1: Run development server and test UI flow**

```bash
npm run dev
```

Expected: All components render correctly, interactions work.

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: Clean build output in `dist/` directory.

- [ ] **Step 3: Commit final build**

```bash
git add .
git commit -m "feat: complete IP Designer Prompt Generator"
```

---

## Plan Self-Review

**1. Spec coverage:** ✅ Complete coverage - all requirements mapped to tasks
- Environment parameters (weather/mood) → Task 5
- Theme selection (primary/secondary) → Task 6
- LLM integration → Task 3
- Results display + copy → Task 7
- API Key management → Task 8

**2. Placeholder scan:** ✅ No TBD/TODOs - all steps have complete code

**3. Type consistency:** ✅ All types match across components
- `AppState` defined in Task 2, used consistently
- Component props match type definitions

---

Plan complete and saved to `docs/superpowers/plans/2026-05-19-ip-designer-prompt-generator.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
