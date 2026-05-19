export interface ThemeOption {
  value: string;
  label: string;
}

export interface ThemeCategory {
  id: string;
  name: string;
  description: string;
  subThemes: string[];
}

export interface LLMResponse {
  success: boolean;
  data?: {
    quote: string;
    image_prompt: string;
  };
  error?: string;
}

export interface AppState {
  weather: string | null;
  mood: string | null;
  primaryTheme: string | null;
  secondaryTheme: string | null;
  quote: string | null;
  imagePrompt: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface GenerationHistory {
  id: string;
  quote: string;
  imagePrompt: string;
  weather: string;
  mood: string;
  primaryTheme: string;
  secondaryTheme: string;
  timestamp: Date;
}
