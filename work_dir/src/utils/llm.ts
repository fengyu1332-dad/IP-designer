export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  finishReason: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamCallback {
  (chunk: string): void;
}

export const DEFAULT_LLM_OPTIONS: LLMOptions = {
  model: 'claude-3-sonnet',
  temperature: 0.7,
  maxTokens: 4096,
  stream: false,
};

export function buildSystemPrompt(purpose: string, context?: string): string {
  let prompt = `你是一个专业的AI助手。\n\n`;
  prompt += `你的任务是：${purpose}\n\n`;
  
  if (context) {
    prompt += `背景信息：\n${context}\n\n`;
  }
  
  prompt += `请用中文清晰、准确地回答问题。`;
  
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
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: mergedOptions.model,
      max_tokens: mergedOptions.maxTokens,
      temperature: mergedOptions.temperature,
      messages,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`LLM API error: ${errorData?.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    content: data.content[0]?.text || '',
    finishReason: data.stop_reason || 'unknown',
    usage: {
      promptTokens: data.usage?.input_tokens || 0,
      completionTokens: data.usage?.output_tokens || 0,
      totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    },
  };
}

export async function callLLMStream(
  apiKey: string,
  messages: LLMMessage[],
  callback: StreamCallback,
  options: LLMOptions = {}
): Promise<void> {
  const mergedOptions = { ...DEFAULT_LLM_OPTIONS, ...options, stream: true };
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: mergedOptions.model,
      max_tokens: mergedOptions.maxTokens,
      temperature: mergedOptions.temperature,
      messages,
      stream: true,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`LLM API error: ${errorData?.error?.message || response.statusText}`);
  }
  
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to get response reader');
  }
  
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      break;
    }
    
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const json = JSON.parse(line.slice(6));
          if (json.type === 'content_block_delta' && json.delta?.text) {
            callback(json.delta.text);
          }
        } catch {
          continue;
        }
      }
    }
  }
}