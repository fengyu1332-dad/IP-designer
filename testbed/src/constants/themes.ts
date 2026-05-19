import type { Theme, WeatherOption, MoodOption } from '../types';

export const WEATHER_OPTIONS: WeatherOption[] = [
  { value: 'sunny', label: '晴天', icon: '☀️' },
  { value: 'rainy', label: '雨天', icon: '🌧️' },
  { value: 'snowy', label: '雪天', icon: '❄️' },
  { value: 'cloudy', label: '多云', icon: '☁️' },
  { value: 'stormy', label: '暴风雨', icon: '⛈️' },
  { value: 'foggy', label: '雾天', icon: '🌫️' },
];

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'peaceful', label: '平静', icon: '😌' },
  { value: 'joyful', label: '喜悦', icon: '😊' },
  { value: 'melancholy', label: '忧郁', icon: '😔' },
  { value: 'romantic', label: '浪漫', icon: '💕' },
  { value: 'adventurous', label: '冒险', icon: '⚡' },
  { value: 'mysterious', label: '神秘', icon: '🌙' },
];

export const THEMES: Theme[] = [
  {
    id: 'sunny-peaceful',
    name: '暖阳静好',
    description: '阳光明媚的午后，微风轻拂，岁月静好',
    primaryColor: '#FFD700',
    secondaryColor: '#FFA500',
    accentColor: '#FF6347',
    backgroundColor: '#FFF8DC',
    textColor: '#333333',
    mood: 'peaceful',
    weather: 'sunny',
    icon: '🌞'
  },
  {
    id: 'rainy-melancholy',
    name: '雨夜情思',
    description: '细雨绵绵，思绪万千，淡淡的忧伤',
    primaryColor: '#4682B4',
    secondaryColor: '#708090',
    accentColor: '#2F4F4F',
    backgroundColor: '#E6E6FA',
    textColor: '#2F4F4F',
    mood: 'melancholy',
    weather: 'rainy',
    icon: '🌧️'
  },
  {
    id: 'snowy-romantic',
    name: '雪夜浪漫',
    description: '银装素裹，雪花纷飞，浪漫的邂逅',
    primaryColor: '#E0FFFF',
    secondaryColor: '#B0C4DE',
    accentColor: '#FFB6C1',
    backgroundColor: '#F0FFFF',
    textColor: '#191970',
    mood: 'romantic',
    weather: 'snowy',
    icon: '❄️'
  },
  {
    id: 'cloudy-peaceful',
    name: '云淡风轻',
    description: '云朵飘浮，微风和煦，宁静致远',
    primaryColor: '#B0C4DE',
    secondaryColor: '#778899',
    accentColor: '#20B2AA',
    backgroundColor: '#F5F5F5',
    textColor: '#4A4A4A',
    mood: 'peaceful',
    weather: 'cloudy',
    icon: '☁️'
  },
  {
    id: 'stormy-adventurous',
    name: '风雨征途',
    description: '狂风暴雨，电闪雷鸣，勇往直前',
    primaryColor: '#2F4F4F',
    secondaryColor: '#483D8B',
    accentColor: '#FFD700',
    backgroundColor: '#1a1a2e',
    textColor: '#E0E0E0',
    mood: 'adventurous',
    weather: 'stormy',
    icon: '⛈️'
  },
  {
    id: 'foggy-mysterious',
    name: '迷雾秘境',
    description: '迷雾重重，神秘莫测，探索未知',
    primaryColor: '#D3D3D3',
    secondaryColor: '#A9A9A9',
    accentColor: '#9370DB',
    backgroundColor: '#F5F5F5',
    textColor: '#2F2F2F',
    mood: 'mysterious',
    weather: 'foggy',
    icon: '🌫️'
  },
  {
    id: 'sunny-joyful',
    name: '阳光灿烂',
    description: '阳光普照，欢声笑语，活力四射',
    primaryColor: '#FF6347',
    secondaryColor: '#FFD700',
    accentColor: '#FF4500',
    backgroundColor: '#FFFAF0',
    textColor: '#333333',
    mood: 'joyful',
    weather: 'sunny',
    icon: '☀️'
  },
  {
    id: 'rainy-romantic',
    name: '雨中浪漫',
    description: '细雨缠绵，情意绵绵，浪漫相依',
    primaryColor: '#1E90FF',
    secondaryColor: '#9370DB',
    accentColor: '#FF69B4',
    backgroundColor: '#F0F8FF',
    textColor: '#2F4F4F',
    mood: 'romantic',
    weather: 'rainy',
    icon: '🌧️'
  }
];

export const getThemeById = (id: string): Theme | undefined => {
  return THEMES.find(theme => theme.id === id);
};

export const getThemesByWeather = (weather: string): Theme[] => {
  return THEMES.filter(theme => theme.weather === weather);
};

export const getThemesByMood = (mood: string): Theme[] => {
  return THEMES.filter(theme => theme.mood === mood);
};
