import type { ThemeConfig } from 'antd';
import type { ThemeMode } from '../constants/theme';
import { getThemeColors } from '../constants/theme';

export const getAntdTheme = (mode: ThemeMode): ThemeConfig => {
  const colors = getThemeColors(mode);
  
  return {
    token: {
      colorPrimary: colors.primary,
      colorSuccess: colors.success,
      colorWarning: colors.warning,
      colorError: colors.error,
      colorBgBase: mode === 'light' ? '#ffffff' : '#141414',
      colorBgContainer: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(20, 20, 20, 0.7)',
      colorBorder: colors.border,
      colorText: colors.text,
      colorTextSecondary: colors.textSecondary,
      borderRadius: 16,
      boxShadow: `0 4px 16px ${colors.shadow}`,
    },
    components: {
      Card: {
        colorBgContainer: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 30, 30, 0.8)',
      },
      Button: {
        colorBgContainer: mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(40, 40, 40, 0.9)',
      },
      Badge: {
        colorBgContainer: colors.primary,
      },
    },
    algorithm: mode === 'dark' ? undefined : undefined,
  };
};
