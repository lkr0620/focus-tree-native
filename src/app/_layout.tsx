import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider } from '@/components/auth-context';
import { PreferencesProvider } from '@/components/preferences-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PreferencesProvider>
        <AuthProvider>
          <AnimatedSplashOverlay />
          <AppTabs />
        </AuthProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
