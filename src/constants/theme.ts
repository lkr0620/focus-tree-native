/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

/**
 * Shared visual identity for the app: a muted, editorial "quiet luxury"
 * palette (deep pine, warm ivory, brass accent) used across screens in
 * place of one-off hex values.
 */
export const Palette = {
  ink: '#171B18',
  inkSoft: '#4B5147',
  muted: '#8C9086',
  mutedLight: '#AEB2A7',
  paper: '#F6F3EA',
  surface: '#FFFFFF',
  surfaceSoft: '#EFEDE2',
  line: '#E6E1D2',
  lineSoft: '#EEEADD',
  primary: '#1F3D2E',
  primaryDeep: '#122318',
  primaryTint: '#E6EBE3',
  gold: '#AD8A50',
  goldDeep: '#8C6F3D',
  goldSoft: '#F1E7D2',
  bark: '#5C4636',
  barkDeep: '#3B2C21',
  danger: '#A14E3F',
  shadow: '#171B18',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
