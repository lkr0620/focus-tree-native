import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

type TabConfig = {
  label: string;
  icon: ComponentProps<typeof SymbolView>['name'];
};

const tabs: Record<string, TabConfig> = {
  index: {
    label: '홈',
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  explore: {
    label: '내 숲',
    icon: { ios: 'tree.fill', android: 'forest', web: 'park' },
  },
  stats: {
    label: '통계',
    icon: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  },
  settings: {
    label: '설정',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
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
                <ThemedText style={[styles.tabLabel, focused && styles.activeTabLabel]}>{tab.label}</ThemedText>
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
    borderTopColor: '#EEF0EA',
    borderTopWidth: 1,
    bottom: 0,
    height: 86,
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    shadowColor: '#C8CEC2',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
  },
  tabRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
  },
  tabSlot: {
    alignItems: 'center',
    height: 66,
    justifyContent: 'center',
    width: 62,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 999,
    gap: 3,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  activeTabButton: {
    backgroundColor: '#AFA697',
  },
  tabLabel: {
    color: '#6F776F',
    fontSize: 12,
    fontWeight: '900',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
});
