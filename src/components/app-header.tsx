import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Fonts, Palette, Spacing } from '@/constants/theme';

import { useAuth } from './auth-context';
import { SproutIcon } from './detox-icons';
import { usePreferences } from './preferences-context';
import { ThemedText } from './themed-text';

type AppHeaderProps = {
  right?: ReactNode;
};

export function AppHeader({ right }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/')}
        style={({ pressed }) => [styles.logoRow, pressed && styles.pressed]}>
        <SproutIcon variant="sm" />
        <ThemedText style={styles.logoText}>새싹 다이어리</ThemedText>
      </Pressable>
      {right}
    </View>
  );
}

// Back-arrow + title row used by the seed/goal flow screens, which sit "inside" a step (not a
// tab), so they need their own back affordance beneath the shared brand row.
export function BackHeaderRow({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack: () => void }) {
  return (
    <View style={styles.backWrap}>
      <View style={styles.backRow}>
        <Pressable accessibilityRole="button" onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </Pressable>
        <ThemedText style={styles.backTitle}>{title}</ThemedText>
      </View>
      {subtitle ? <ThemedText style={styles.backSubtitle}>{subtitle}</ThemedText> : null}
    </View>
  );
}

const menuCopy = {
  ko: { greeting: '오늘도 애써주셔서 고마워요', logout: '로그아웃', settings: '설정' },
  en: { greeting: 'Thanks for showing up today', logout: 'Log Out', settings: 'Settings' },
} as const;

export function AvatarMenu() {
  const { logout, user } = useAuth();
  const { language } = usePreferences();
  const [open, setOpen] = useState(false);
  const text = menuCopy[language];

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(current => !current)}
        style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
        <View style={styles.avatarHead} />
        <View style={styles.avatarBody} />
      </Pressable>

      {open ? (
        <View style={styles.menu}>
          <ThemedText style={styles.menuEmail}>{user?.email ?? 'detox@example.com'}</ThemedText>
          <ThemedText style={styles.menuGreeting}>{text.greeting}</ThemedText>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setOpen(false);
              router.push('/settings');
            }}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
            <ThemedText style={styles.menuButtonText}>{text.settings}</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setOpen(false);
              logout();
              router.replace('/login');
            }}
            style={({ pressed }) => [styles.menuButton, styles.logoutButton, pressed && styles.pressed]}>
            <ThemedText style={styles.menuButtonText}>{text.logout}</ThemedText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 14,
    paddingHorizontal: Spacing.three,
    paddingTop: 14,
    borderBottomColor: Palette.ring,
    borderBottomWidth: 1,
    // Elevated above the scrollable content below it, which is otherwise a later sibling in the
    // same flex container and would paint over the avatar dropdown despite the dropdown's own
    // zIndex (that only wins against sibling elements within this header, not across it).
    zIndex: 10,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoText: {
    color: Palette.textSoft,
    fontFamily: Fonts?.display,
    fontSize: 13,
  },
  avatarButton: {
    backgroundColor: Palette.ring,
    borderRadius: 17,
    flexShrink: 0,
    height: 34,
    overflow: 'hidden',
    position: 'relative',
    width: 34,
  },
  avatarHead: {
    backgroundColor: Palette.primaryDark,
    borderRadius: 6,
    height: 12,
    left: '50%',
    marginLeft: -6,
    position: 'absolute',
    top: 8,
    width: 12,
  },
  avatarBody: {
    backgroundColor: Palette.primaryDark,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    bottom: -6,
    height: 16,
    left: '50%',
    marginLeft: -11,
    position: 'absolute',
    width: 22,
  },
  menu: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    gap: 4,
    padding: 16,
    position: 'absolute',
    right: Spacing.three,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    top: 44,
    width: 200,
    zIndex: 20,
  },
  menuEmail: {
    color: Palette.text,
    fontSize: 12.5,
    fontWeight: '600',
  },
  menuGreeting: {
    color: Palette.textSoft,
    fontSize: 11,
    marginBottom: 6,
  },
  menuButton: {
    backgroundColor: Palette.ring,
    borderRadius: 10,
    marginTop: 6,
    paddingVertical: 9,
  },
  logoutButton: {
    backgroundColor: Palette.surfaceSoft,
  },
  menuButtonText: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 12.5,
    textAlign: 'center',
  },
  backWrap: {
    paddingHorizontal: Spacing.three,
  },
  backRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  backArrow: {
    color: Palette.text,
    fontSize: 16,
  },
  backTitle: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 19,
  },
  backSubtitle: {
    color: Palette.textSoft,
    fontSize: 13,
    marginLeft: 44,
    marginTop: 6,
  },
  pressed: {
    opacity: 0.82,
  },
});
