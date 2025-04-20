// src/styles/theme.ts - Тема приложения
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#4CAF50',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#D32F2F',
    text: '#212121',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
};