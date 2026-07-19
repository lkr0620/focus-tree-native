import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider } from '@/components/auth-context';
import { DetoxProvider } from '@/components/detox-context';
import { PreferencesProvider } from '@/components/preferences-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    NavigationBar.setBehaviorAsync('overlay-swipe');
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PreferencesProvider>
        <AuthProvider>
          <DetoxProvider>
            <AnimatedSplashOverlay />
            <AppTabs />
          </DetoxProvider>
        </AuthProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
