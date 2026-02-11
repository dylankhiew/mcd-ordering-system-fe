export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeMode = typeof ThemeMode[keyof typeof ThemeMode];

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceLight: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
}

export const LIGHT_THEME_COLORS: ThemeColors = {
  primary: '#FA8072', // Salmon
  secondary: '#FF6B6B',
  background: '#f5f5f5',
  surface: 'rgba(255, 255, 255, 0.7)',
  surfaceLight: 'rgba(255, 255, 255, 0.5)',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: 'rgba(0, 0, 0, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  success: '#52c41a',
  warning: '#fa8c16',
  error: '#ff4d4f',
};

export const DARK_THEME_COLORS: ThemeColors = {
  primary: '#FA8072', // Salmon
  secondary: '#FF6B6B',
  background: '#0a0a0a',
  surface: 'rgba(20, 20, 20, 0.7)',
  surfaceLight: 'rgba(30, 30, 30, 0.5)',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.5)',
  success: '#52c41a',
  warning: '#fa8c16',
  error: '#ff4d4f',
};

export interface GlassStyles {
  blur: string;
  borderRadius: string;
  border: string;
  opacity: number;
}

export const GLASS_STYLES: GlassStyles = {
  blur: '10px',
  borderRadius: '16px',
  border: '1px solid',
  opacity: 0.8,
};

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  return mode === 'light' ? LIGHT_THEME_COLORS : DARK_THEME_COLORS;
};
