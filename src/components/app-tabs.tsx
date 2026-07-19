import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Palette } from '@/constants/theme';

import { useAuth } from './auth-context';
import { usePreferences } from './preferences-context';
import { ThemedText } from './themed-text';

type TabConfig = {
  label: {
    en: string;
    ko: string;
  };
  icon: ComponentProps<typeof SymbolView>['name'];
};

// Matches the design's 3-tab bar (홈/정원/사용량) — the design has no dedicated settings tab;
// settings is reachable from the avatar dropdown menu instead (see app-header.tsx).
const tabs: Record<string, TabConfig> = {
  index: {
    label: { en: 'Home', ko: '홈' },
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  explore: {
    label: { en: 'Garden', ko: '정원' },
    icon: { ios: 'leaf.fill', android: 'eco', web: 'eco' },
  },
  stats: {
    label: { en: 'Usage', ko: '사용량' },
    icon: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { user } = useAuth();
  const { language } = usePreferences();
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index];

  if (!tabs[currentRoute.name]) {
    return null;
  }

  return (
    <View style={[styles.tabBar, { bottom: 12 + insets.bottom }]}>
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tab = tabs[route.name];

          if (!tab) {
            return null;
          }

          const onPress = () => {
            if (!user && route.name !== 'index') {
              router.push('/login');
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : undefined}
              onPress={onPress}
              style={styles.tabSlot}>
              <View style={[styles.tabButton, focused && styles.activeTabButton]}>
                <SymbolView name={tab.icon} tintColor={focused ? '#FFFFFF' : Palette.mutedLight} size={22} />
                <ThemedText numberOfLines={1} style={[styles.tabLabel, focused && styles.activeTabLabel]}>
                  {tab.label[language]}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="explore" options={{ title: '정원' }} />
      <Tabs.Screen name="stats" options={{ title: '사용량' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Palette.surface,
    borderColor: Palette.ring,
    borderRadius: 28,
    borderWidth: 1,
    bottom: 12,
    height: 78,
    left: 14,
    paddingHorizontal: 14,
    position: 'absolute',
    right: 14,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  tabRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-around',
  },
  tabSlot: {
    alignItems: 'center',
    height: 62,
    justifyContent: 'center',
    width: 92,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 999,
    gap: 3,
    height: 58,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: 90,
  },
  activeTabButton: {
    backgroundColor: Palette.primary,
    shadowColor: 'rgba(123,174,127,0.4)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 14,
  },
  tabLabel: {
    color: Palette.mutedLight,
    fontFamily: Fonts?.display,
    fontSize: 11,
    lineHeight: 14,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
});
