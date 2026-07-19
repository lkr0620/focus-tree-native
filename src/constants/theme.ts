import '@/global.css';

import { Platform } from 'react-native';

/**
 * Shared visual identity for the app: the "새싹 다이어리" (Sprout Diary) digital-detox
 * palette — warm cream paper, soft sage green, honey-gold accent, muted clay for
 * withered/negative states. Ported 1:1 from the approved design (`--bg`, `--text`, etc.)
 * plus a few derived tones (inkSoft, mutedLight, surfaceSoft, primaryTint) that the
 * design computed ad hoc per-component but this app reuses as shared tokens.
 */
export const Palette = {
  // Core tokens, named to match the source design's CSS variables 1:1.
  bg: '#FBF7EF',
  surface: '#FFFFFF',
  text: '#4A3B2C',
  textSoft: '#9A8A78',
  primary: '#7BAE7F',
  primaryDark: '#5F8F63',
  accent: '#D8A657',
  brown: '#8C6E54',
  wither: '#B7715C',
  ring: '#EFE6D6',

  // Structural aliases used throughout the screens.
  paper: '#FBF7EF',
  ink: '#4A3B2C',
  inkSoft: '#6B5A46',
  muted: '#9A8A78',
  mutedLight: '#B9AB94',
  line: '#EFE6D6',
  surfaceSoft: '#F5EFE1',
  primaryTint: '#E7F1E4',
  danger: '#C4573F',
  shadow: '#4A3B2C',
} as const;

// `display` (headings) uses Jua, a rounded hand-drawn Korean display face; `sans` (body) uses
// Gowun Dodum, a soft humanist Korean sans — both loaded via Google Fonts on web (see +html.tsx).
// Native platforms fall back to the system default since the actual font files aren't bundled.
export const Fonts = Platform.select({
  ios: {
    display: 'system-ui',
    sans: 'system-ui',
  },
  default: {
    display: 'sans-serif',
    sans: 'sans-serif',
  },
  web: {
    display: 'var(--font-display)',
    sans: 'var(--font-body)',
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
