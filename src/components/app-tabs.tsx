import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

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

const tabs: Record<string, TabConfig> = {
  index: {
    label: { en: 'Home', ko: '홈' },
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  explore: {
    label: { en: 'My Forest', ko: '내 숲' },
    icon: { ios: 'tree.fill', android: 'forest', web: 'park' },
  },
  stats: {
    label: { en: 'Stats', ko: '통계' },
    icon: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  },
  settings: {
    label: { en: 'Settings', ko: '설정' },
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { user } = useAuth();
  const { language } = usePreferences();
  const currentRoute = state.routes[state.index];

  if (!tabs[currentRoute.name]) {
    return null;
  }

  return (
    <View style={styles.tabBar}>
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
                <SymbolView name={tab.icon} tintColor={focused ? '#FFFFFF' : '#747B73'} size={22} />
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
      <Tabs.Screen name="explore" options={{ title: '내 숲' }} />
      <Tabs.Screen name="stats" options={{ title: '통계' }} />
      <Tabs.Screen name="settings" options={{ title: '설정' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E2D3',
    borderRadius: 28,
    borderWidth: 1,
    bottom: 12,
    height: 78,
    left: 14,
    paddingHorizontal: 14,
    position: 'absolute',
    right: 14,
    shadowColor: '#7C8D76',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  tabRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
  },
  tabSlot: {
    alignItems: 'center',
    height: 62,
    justifyContent: 'center',
    width: 84,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 999,
    gap: 3,
    height: 58,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: 82,
  },
  activeTabButton: {
    backgroundColor: '#8A5F45',
    shadowColor: '#8A5F45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },
  tabLabel: {
    color: '#5D685B',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
});
