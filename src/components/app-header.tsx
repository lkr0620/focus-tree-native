import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

import { useAuth } from './auth-context';
import { ThemedText } from './themed-text';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

type AppHeaderProps = {
  title?: string;
  leftMode?: 'brand' | 'leaf';
  rightIcon?: SymbolName;
  rightIconColor?: string;
  rightIconSize?: number;
  onRightPress?: () => void;
  rightButtonTone?: 'plain' | 'soft';
};

export function AppHeader({
  title,
  leftMode = 'brand',
  rightIcon = { ios: 'person.circle', android: 'account_circle', web: 'account_circle' },
  rightIconColor = '#1F2A21',
  rightIconSize = 22,
  onRightPress,
  rightButtonTone = 'plain',
}: AppHeaderProps) {
  const { user } = useAuth();
  const handleRightPress = onRightPress ?? (() => router.push(user ? '/settings' : '/login'));

  return (
    <View style={styles.header}>
      <View style={styles.sideSlot}>
        {leftMode === 'brand' ? (
          <View style={styles.logoRow}>
            <SymbolView name={{ ios: 'leaf', android: 'eco', web: 'eco' }} tintColor="#4B6D51" size={21} />
            <ThemedText style={styles.logoText}>Soom</ThemedText>
          </View>
        ) : (
          <SymbolView name={{ ios: 'leaf', android: 'eco', web: 'eco' }} tintColor="#4B6D51" size={24} />
        )}
      </View>
      {title ? <ThemedText style={styles.title}>{title}</ThemedText> : null}
      <Pressable
        accessibilityRole="button"
        onPress={handleRightPress}
        style={({ pressed }) => [styles.iconButton, rightButtonTone === 'soft' && styles.softIconButton, pressed && styles.pressed]}>
        <SymbolView name={rightIcon} tintColor={rightIconColor} size={rightIconSize} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#DDE6DA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
    paddingBottom: 16,
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    width: '100%',
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoText: {
    color: '#2F6840',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  sideSlot: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 82,
  },
  title: {
    color: '#4B6D51',
    fontSize: 21,
    fontWeight: '900',
    left: 0,
    lineHeight: 28,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#EAF2E8',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  softIconButton: {
    backgroundColor: '#E9DED3',
  },
  pressed: {
    opacity: 0.82,
  },
});
