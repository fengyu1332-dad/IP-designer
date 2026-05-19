import { useState, useCallback, useRef } from 'react';
import { 
  LLMMessage, 
  LLMOptions, 
  LLMResponse, 
  DEFAULT_LLM_OPTIONS,
  buildSystemPrompt,
  buildMessages,
  callLLM,
  callLLMStream 
} from '../utils/llm';

export interface UseLLMState {
  isLoading: boolean;
  error: Error | null;
  response: LLMResponse | null;
  streamedContent: string;
}

export interface UseLLMResult extends UseLLMState {
  sendMessage: (
    userPrompt: string,
    options?: LLMOptions
  ) => Promise<LLMResponse | null>;
  sendMessageStream: (
    userPrompt: string,
    options?: LLMOptions
  ) => Promise<void>;
  setApiKey: (apiKey: string) => void;
  setSystemPrompt: (prompt: string) => void;
  addToHistory: (message: LLMMessage) => void;
  clearHistory: () => void;
  reset: () => void;
}

export function useLLM(apiKey: string, systemPrompt: string): UseLLMResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<LLMResponse | null>(null);
  const [streamedContent, setStreamedContent] = useState('');
  const [history, setHistory] = useState<LLMMessage[]>([]);
  const apiKeyRef = useRef(apiKey);
  const systemPromptRef = useRef(systemPrompt);

  const setApiKey = useCallback((newApiKey: string) => {
    apiKeyRef.current = newApiKey;
  }, []);

  const setSystemPrompt = useCallback((newPrompt: string) => {
    systemPromptRef.current = newPrompt;
  }, []);

  const addToHistory = useCallback((message: LLMMessage) => {
    setHistory(prev => [...prev, message]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResponse(null);
    setStreamedContent('');
  }, []);

  const sendMessage = useCallback(async (
    userPrompt: string,
    options: LLMOptions = {}
  ): Promise<LLMResponse | null> => {
    if (!apiKeyRef.current) {
      setError(new Error('API key is not set'));
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const messages = buildMessages(
        systemPromptRef.current,
        userPrompt,
        history
      );

      const mergedOptions = { ...DEFAULT_LLM_OPTIONS, ...options };
      const result = await callLLM(apiKeyRef.current, messages, mergedOptions);

      setResponse(result);
      addToHistory({ role: 'user', content: userPrompt });
      addToHistory({ role: 'assistant', content: result.content });

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [history, addToHistory]);

  const sendMessageStream = useCallback(async (
    userPrompt: string,
    options: LLMOptions = {}
  ): Promise<void> => {
    if (!apiKeyRef.current) {
      setError(new Error('API key is not set'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setStreamedContent('');

    try {
      const messages = buildMessages(
        systemPromptRef.current,
        userPrompt,
        history
      );

      const mergedOptions = { ...DEFAULT_LLM_OPTIONS, ...options, stream: true };
      
      await callLLMStream(
        apiKeyRef.current,
        messages,
        (chunk) => {
          setStreamedContent(prev => prev + chunk);
        },
        mergedOptions
      );

      const finalContent = streamedContent;
      addToHistory({ role: 'user', content: userPrompt });
      addToHistory({ role: 'assistant', content: finalContent });

      setResponse({
        content: finalContent,
        finishReason: 'stop',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [history, streamedContent, addToHistory]);

  return {
    isLoading,
    error,
    response,
    streamedContent,
    sendMessage,
    sendMessageStream,
    setApiKey,
    setSystemPrompt,
    addToHistory,
    clearHistory,
    reset,
  };
}