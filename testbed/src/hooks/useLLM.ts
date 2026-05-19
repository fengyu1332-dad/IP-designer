import { useState, useCallback, useRef } from 'react';
import {
  LLMMessage,
  LLMOptions,
  LLMResponse,
  DEFAULT_LLM_OPTIONS,
  buildSystemPrompt,
  buildMessages,
  callLLM,
} from '../utils/llm';

export interface UseLLMState {
  isLoading: boolean;
  error: string | null;
  quote: string | null;
  imagePrompt: string | null;
}

export interface UseLLMResult extends UseLLMState {
  generate: (params: {
    date: string;
    weather: string;
    mood: string;
    primaryTheme: string;
    secondaryTheme: string;
    apiKey: string;
    apiBase?: string;
  }) => Promise<void>;
  reset: () => void;
}

export function useLLM(): UseLLMResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);

  const generate = useCallback(async (params: {
    date: string;
    weather: string;
    mood: string;
    primaryTheme: string;
    secondaryTheme: string;
    apiKey: string;
    apiBase?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserPrompt(params);
      const messages = buildMessages(systemPrompt, userPrompt);

      const options: LLMOptions = {
        apiBase: params.apiBase,
      };

      const result = await callLLM(params.apiKey, messages, options);

      if (result.success && result.data) {
        setQuote(result.data.quote);
        setImagePrompt(result.data.image_prompt);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setQuote(null);
    setImagePrompt(null);
  }, []);

  return {
    isLoading,
    error,
    quote,
    imagePrompt,
    generate,
    reset,
  };
}
