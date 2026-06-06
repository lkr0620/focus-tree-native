import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

type TabIconProps = {
  focused: boolean;
  color: string;
  icon: {
    ios: 'house' | 'tree.fill' | 'gearshape';
    android: 'home' | 'forest' | 'settings';
    web: 'home' | 'park' | 'settings';
  };
  label: string;
};

function TabIcon({ focused, color, icon, label }: TabIconProps) {
  return (
    <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
      <SymbolView name={icon} tintColor={color} size={23} />
      <ThemedText style={[styles.iconLabel, focused && styles.activeIconLabel]}>{label}</ThemedText>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#2F6D4E',
        tabBarInactiveTintColor: '#1F2937',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label="홈" icon={{ ios: 'house', android: 'home', web: 'home' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '숲',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              label="숲"
              icon={{ ios: 'tree.fill', android: 'forest', web: 'park' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              label="설정"
              icon={{ ios: 'gearshape', android: 'settings', web: 'settings' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFF0E3',
    borderTopWidth: 0,
    borderRadius: 28,
    bottom: 14,
    elevation: 0,
    height: 76,
    left: 18,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    right: 18,
    shadowOpacity: 0,
  },
  tabBarItem: {
    borderRadius: 28,
    height: 60,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 28,
    gap: 4,
    height: 60,
    justifyContent: 'center',
    minWidth: 74,
    paddingHorizontal: 14,
  },
  activeIconWrap: {
    backgroundColor: '#9ED7B8',
    minWidth: 98,
  },
  iconLabel: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '700',
  },
  activeIconLabel: {
    color: '#2F6D4E',
  },
});
