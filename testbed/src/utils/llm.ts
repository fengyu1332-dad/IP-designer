export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  apiBase?: string;
}

export interface LLMResponse {
  success: boolean;
  data?: {
    quote: string;
    image_prompt: string;
  };
  error?: string;
}

export const DEFAULT_LLM_OPTIONS: LLMOptions = {
  model: 'deepseek-v4-flash',
  temperature: 0.7,
  maxTokens: 2048,
  stream: false,
  apiBase: 'https://api.deepseek.com/v1',
};

export function buildSystemPrompt(params: {
  date: string;
  weather: string;
  mood: string;
  primaryTheme: string;
  secondaryTheme: string;
  aspectRatio?: string;
}): string {
  const aspectRatio = params.aspectRatio || '3:4';
  return `# Role
你是一个顶级的社交媒体内容总监与 AI 视觉提示词（Prompt）专家。

# Objective
根据用户提供的环境参数和特定主题，创作一句极具共情力、适合作为配图文字的中文金句，并配套生成一段极其专业、细节丰富的英文 AI 绘图 Prompt。

# Input Parameters
- 日期/节气：${params.date}
- 天气/光影：${params.weather}
- 当前情绪：${params.mood}
- 核心主题：${params.primaryTheme} -> ${params.secondaryTheme}
- 画面宽高比：${aspectRatio}

# Workflow
1. 分析输入参数，寻找环境、情绪与核心主题之间的内在联系与张力。
2. 撰写中文金句：字数限制在 15-30 字。风格需深刻、克制、真实。如果是专业信念，需体现契约精神；如果是硬核爱好或教育规划，需体现探索与严谨；如果是人文关怀，需体现科技与人性的温度。
3. 构建英文 Prompt：
   - 必须使用英文
   - 结构需包含：主体描述（极度具体）、背景环境，光影设置（如 Cinematic lighting, volumetric light）、摄影机视角（如 50mm lens, depth of field）、画面风格（如 photorealistic, documentary style, minimalist）
   - 避免直接将中文金句翻译成英文，而是要描绘金句所传达的视觉意象
   - 结尾必须加上宽高比参数 --ar ${aspectRatio}

# Output Format (Strict JSON)
{
  "quote": "生成的中文金句",
  "image_prompt": "生成的英文绘图 Prompt（必须包含 --ar ${aspectRatio}）"
}`;
}

export function buildUserPrompt(params: {
  date: string;
  weather: string;
  mood: string;
  primaryTheme: string;
  secondaryTheme: string;
  aspectRatio?: string;
}): string {
  let prompt = `日期/节气：${params.date}\n`;
  prompt += `天气/光影：${params.weather}\n`;
  prompt += `当前情绪：${params.mood}\n`;
  prompt += `核心主题：${params.primaryTheme} -> ${params.secondaryTheme}`;
  return prompt;
}

export function buildMessages(
  systemPrompt: string,
  userPrompt: string,
  history?: LLMMessage[]
): LLMMessage[] {
  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
  ];
  
  if (history) {
    messages.push(...history);
  }
  
  messages.push({ role: 'user', content: userPrompt });
  
  return messages;
}

export async function callLLM(
  apiKey: string,
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const mergedOptions = { ...DEFAULT_LLM_OPTIONS, ...options };
  const apiBase = mergedOptions.apiBase || 'https://api.openai.com/v1';
  
  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: mergedOptions.model,
        messages: messages,
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens,
        response_format: { type: 'json_object' },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: `LLM API error: ${errorData?.error?.message || response.statusText}`,
      };
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    try {
      const parsed = JSON.parse(content);
      return {
        success: true,
        data: {
          quote: parsed.quote || '',
          image_prompt: parsed.image_prompt || '',
        },
      };
    } catch {
      return {
        success: false,
        error: 'Failed to parse JSON response from LLM',
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      error: message,
    };
  }
}
