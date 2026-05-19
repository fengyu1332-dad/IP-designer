export interface Theme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  mood: string;
  weather: string;
  icon: string;
}

export interface WeatherOption {
  value: string;
  label: string;
  icon: string;
}

export interface MoodOption {
  value: string;
  label: string;
  icon: string;
}

export interface LLMResponse {
  success: boolean;
  data?: {
    poem: string;
    imagePrompt: string;
    style: string;
    colorPalette: string[];
  };
  error?: string;
}

export interface AppState {
  currentTheme: Theme | null;
  selectedWeather: string;
  selectedMood: string;
  generatedPoem: string;
  generatedImageUrl: string;
  isGenerating: boolean;
  error: string | null;
  history: GenerationHistory[];
}

export interface GenerationHistory {
  id: string;
  poem: string;
  imageUrl: string;
  theme: Theme;
  timestamp: Date;
}

export interface PromptConfig {
  weather: string;
  mood: string;
  style: string;
}
