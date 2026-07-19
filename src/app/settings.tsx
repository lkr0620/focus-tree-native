import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { useAuth } from '@/components/auth-context';
import { usePreferences, type AppLanguage } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Palette, Spacing } from '@/constants/theme';

const focusSettings = [
  {
    id: 'appLimit',
    title: '앱 제한 관리',
    icon: { ios: 'timer', android: 'timer_off', web: 'timer_off' },
    accessory: 'chevron',
  },
  {
    id: 'doNotDisturb',
    title: '방해 금지 모드',
    icon: { ios: 'minus.circle', android: 'do_not_disturb_on', web: 'do_not_disturb_on' },
    accessory: 'switchOn',
  },
  {
    id: 'dailyGoal',
    title: '일일 목표 설정',
    value: '60분',
    icon: { ios: 'flag', android: 'outlined_flag', web: 'outlined_flag' },
    accessory: 'chevron',
  },
] as const;

const appSettings = [
  {
    id: 'notifications',
    title: '알림 설정',
    icon: { ios: 'bell', android: 'notifications', web: 'notifications' },
    accessory: 'chevron',
  },
  {
    id: 'darkMode',
    title: '다크 모드',
    icon: { ios: 'moon', android: 'dark_mode', web: 'dark_mode' },
    accessory: 'switchOff',
  },
  {
    id: 'language',
    title: '언어 선택',
    value: '한국어',
    icon: { ios: 'globe', android: 'language', web: 'language' },
    accessory: 'chevron',
  },
] as const;

const generalSettings = [
  {
    id: 'about',
    title: '숨(Soom) 정보',
    icon: { ios: 'info.circle', android: 'info', web: 'info' },
    accessory: 'chevron',
  },
  {
    id: 'version',
    title: '버전 정보',
    value: 'v1.2.0',
    icon: { ios: 'iphone', android: 'system_update_alt', web: 'system_update_alt' },
    accessory: 'value',
  },
] as const;

type SettingItem = (typeof focusSettings)[number] | (typeof appSettings)[number] | (typeof generalSettings)[number];
type ValueOverrides = Record<string, string>;

const dailyGoalOptions = ['30분', '60분', '90분', '120분'] as const;
const appLimitOptions = ['5개 앱', '7개 앱', '10개 앱', '모든 방해 앱'] as const;
const dailyGoalOptionsEn = ['30 min', '60 min', '90 min', '120 min'] as const;
const appLimitOptionsEn = ['5 apps', '7 apps', '10 apps', 'All distracting apps'] as const;

const copy = {
  ko: {
    appLimit: '앱 제한 관리',
    appLimitChanged: '앱 제한 범위가 {value}으로 변경되었습니다.',
    appSettings: '앱 설정',
    about: '새싹 다이어리 정보',
    aboutMessage: '새싹 다이어리는 폰 사용을 줄일수록 나무가 자라는 디지털 디톡스 앱입니다.',
    dailyGoal: '일일 목표 설정',
    dailyGoalChanged: '일일 목표가 {value}으로 변경되었습니다.',
    darkMode: '다크 모드',
    darkModeOff: '다크 모드가 꺼졌습니다.',
    darkModeOn: '다크 모드가 켜졌습니다.',
    doNotDisturb: '방해 금지 모드',
    doNotDisturbOff: '방해 금지 모드가 꺼졌습니다.',
    doNotDisturbOn: '방해 금지 모드가 켜졌습니다.',
    focusSettings: '집중 설정',
    footer: 'CRAFTED FOR INNER PEACE',
    general: '일반',
    language: '언어 선택',
    languageChanged: '언어가 한국어로 변경되었습니다.',
    login: '로그인하기',
    logout: '로그아웃',
    notifications: '알림 설정',
    notificationsOff: '알림이 꺼졌습니다.',
    notificationsOn: '알림이 켜졌습니다.',
    off: '꺼짐',
    on: '켜짐',
    profileDefaultLevel: 'lv.12 숲의 수호자',
    profileDefaultName: '숨 쉬는 나',
    profileMessage: '{name}님의 계정 정보가 연결되어 있습니다.',
    statusDefault: '설정을 선택하면 바로 반영됩니다.',
    version: '버전 정보',
    versionMessage: '현재 버전은 v1.2.0입니다.',
  },
  en: {
    appLimit: 'App Limits',
    appLimitChanged: 'App limit scope changed to {value}.',
    appSettings: 'App Settings',
    about: 'About Sprout Diary',
    aboutMessage: 'Sprout Diary is a digital-detox app where your tree grows the less you use your phone.',
    dailyGoal: 'Daily Goal',
    dailyGoalChanged: 'Daily goal changed to {value}.',
    darkMode: 'Dark Mode',
    darkModeOff: 'Dark mode is off.',
    darkModeOn: 'Dark mode is on.',
    doNotDisturb: 'Do Not Disturb',
    doNotDisturbOff: 'Do Not Disturb is off.',
    doNotDisturbOn: 'Do Not Disturb is on.',
    focusSettings: 'Focus Settings',
    footer: 'CRAFTED FOR INNER PEACE',
    general: 'General',
    language: 'Language',
    languageChanged: 'Language changed to English.',
    login: 'Log In',
    logout: 'Log Out',
    notifications: 'Notifications',
    notificationsOff: 'Notifications are off.',
    notificationsOn: 'Notifications are on.',
    off: 'Off',
    on: 'On',
    profileDefaultLevel: 'lv.12 Forest Guardian',
    profileDefaultName: 'Breathing Me',
    profileMessage: "{name}'s account is connected.",
    statusDefault: 'Choose a setting to apply it right away.',
    version: 'Version',
    versionMessage: 'Current version is v1.2.0.',
  },
} as const;

function formatMessage(template: string, value: string) {
  return template.replace('{value}', value).replace('{name}', value);
}

function Accessory({
  doNotDisturb,
  item,
  darkMode,
  onToggleDarkMode,
  onToggleDoNotDisturb,
  valueOverrides,
}: {
  doNotDisturb: boolean;
  item: SettingItem;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleDoNotDisturb: () => void;
  valueOverrides: ValueOverrides;
}) {
  if (item.accessory === 'switchOn' || item.accessory === 'switchOff') {
    const isDarkMode = item.title === '다크 모드';

    return (
      <Switch
        ios_backgroundColor={Palette.line}
        onValueChange={isDarkMode ? onToggleDarkMode : onToggleDoNotDisturb}
        thumbColor={Palette.surface}
        trackColor={{ false: Palette.line, true: Palette.primary }}
        value={isDarkMode ? darkMode : doNotDisturb}
      />
    );
  }

  const displayValue = valueOverrides[item.title] ?? ('value' in item ? item.value : '');

  return (
    <View style={styles.accessoryRow}>
      {displayValue ? <ThemedText style={styles.valueText}>{displayValue}</ThemedText> : null}
      {item.accessory === 'chevron' ? (
        <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={Palette.mutedLight} size={20} />
      ) : null}
    </View>
  );
}

function SettingRow({
  doNotDisturb,
  item,
  darkMode,
  isLast,
  onItemPress,
  onToggleDarkMode,
  onToggleDoNotDisturb,
  valueOverrides,
}: {
  doNotDisturb: boolean;
  item: SettingItem;
  darkMode: boolean;
  isLast: boolean;
  onItemPress: (item: SettingItem) => void;
  onToggleDarkMode: () => void;
  onToggleDoNotDisturb: () => void;
  valueOverrides: ValueOverrides;
}) {
  return (
    <Pressable onPress={() => onItemPress(item)} style={({ pressed }) => [styles.settingRow, isLast && styles.lastRow, pressed && styles.pressed]}>
      <SymbolView name={item.icon} tintColor={Palette.primary} size={22} />
      <ThemedText style={styles.settingTitle}>{valueOverrides[`${item.id}:title`] ?? item.title}</ThemedText>
      <Accessory
        darkMode={darkMode}
        doNotDisturb={doNotDisturb}
        item={item}
        onToggleDarkMode={onToggleDarkMode}
        onToggleDoNotDisturb={onToggleDoNotDisturb}
        valueOverrides={valueOverrides}
      />
    </Pressable>
  );
}

function SettingSection({
  doNotDisturb,
  items,
  darkMode,
  onItemPress,
  onToggleDarkMode,
  onToggleDoNotDisturb,
  title,
  valueOverrides,
}: {
  doNotDisturb: boolean;
  items: readonly SettingItem[];
  darkMode: boolean;
  onItemPress: (item: SettingItem) => void;
  onToggleDarkMode: () => void;
  onToggleDoNotDisturb: () => void;
  title: string;
  valueOverrides: ValueOverrides;
}) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <SettingRow
            darkMode={darkMode}
            doNotDisturb={doNotDisturb}
            isLast={index === items.length - 1}
            item={item}
            key={item.title}
            onItemPress={onItemPress}
            onToggleDarkMode={onToggleDarkMode}
            onToggleDoNotDisturb={onToggleDoNotDisturb}
            valueOverrides={valueOverrides}
          />
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const { language, setLanguage } = usePreferences();
  const [appLimitIndex, setAppLimitIndex] = useState(1);
  const [dailyGoalIndex, setDailyGoalIndex] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const text = copy[language];
  const localizedDailyGoals = language === 'ko' ? dailyGoalOptions : dailyGoalOptionsEn;
  const localizedAppLimits = language === 'ko' ? appLimitOptions : appLimitOptionsEn;

  const valueOverrides = {
    'appLimit:title': text.appLimit,
    'doNotDisturb:title': text.doNotDisturb,
    'dailyGoal:title': text.dailyGoal,
    'notifications:title': text.notifications,
    'darkMode:title': text.darkMode,
    'language:title': text.language,
    'about:title': text.about,
    'version:title': text.version,
    '앱 제한 관리': localizedAppLimits[appLimitIndex],
    '일일 목표 설정': localizedDailyGoals[dailyGoalIndex],
    '알림 설정': notificationsEnabled ? text.on : text.off,
    '언어 선택': language === 'ko' ? '한국어' : 'English',
  };

  const toggleDoNotDisturb = () => {
    setDoNotDisturb(current => {
      const next = !current;
      setStatusMessage(next ? text.doNotDisturbOn : text.doNotDisturbOff);
      return next;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(current => {
      const next = !current;
      setStatusMessage(next ? text.darkModeOn : text.darkModeOff);
      return next;
    });
  };

  const handleItemPress = (item: SettingItem) => {
    if (item.id === 'doNotDisturb') {
      toggleDoNotDisturb();
      return;
    }

    if (item.id === 'darkMode') {
      toggleDarkMode();
      return;
    }

    if (item.id === 'appLimit') {
      setAppLimitIndex(current => {
        const next = (current + 1) % appLimitOptions.length;
        setStatusMessage(formatMessage(text.appLimitChanged, localizedAppLimits[next]));
        return next;
      });
      return;
    }

    if (item.id === 'dailyGoal') {
      setDailyGoalIndex(current => {
        const next = (current + 1) % dailyGoalOptions.length;
        setStatusMessage(formatMessage(text.dailyGoalChanged, localizedDailyGoals[next]));
        return next;
      });
      return;
    }

    if (item.id === 'notifications') {
      setNotificationsEnabled(current => {
        const next = !current;
        setStatusMessage(next ? text.notificationsOn : text.notificationsOff);
        return next;
      });
      return;
    }

    if (item.id === 'language') {
      const nextLanguage: AppLanguage = language === 'ko' ? 'en' : 'ko';
      setLanguage(nextLanguage);
      setStatusMessage(copy[nextLanguage].languageChanged);
      return;
    }

    if (item.id === 'about') {
      setStatusMessage(text.aboutMessage);
      return;
    }

    if (item.id === 'version') {
      setStatusMessage(text.versionMessage);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Pressable
              onPress={() => {
                if (!user) {
                  router.push('/login');
                  return;
                }

                setStatusMessage(formatMessage(text.profileMessage, user.name));
              }}
              style={({ pressed }) => [styles.profileCard, pressed && styles.pressed]}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar} />
                <View style={styles.avatarLeaf}>
                  <SymbolView name={{ ios: 'leaf.fill', android: 'eco', web: 'eco' }} tintColor="#FFFFFF" size={14} />
                </View>
              </View>
              <View style={styles.profileCopy}>
                <ThemedText style={styles.profileName}>{user ? `${user.name}${language === 'ko' ? '님' : ''}` : text.profileDefaultName}</ThemedText>
                <ThemedText style={styles.profileLevel}>{user ? user.email : text.profileDefaultLevel}</ThemedText>
              </View>
              <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={Palette.mutedLight} size={22} />
            </Pressable>

            <View style={styles.statusCard}>
              <ThemedText style={styles.statusText}>{statusMessage || text.statusDefault}</ThemedText>
            </View>

            <SettingSection
              darkMode={darkMode}
              doNotDisturb={doNotDisturb}
              items={focusSettings}
              onItemPress={handleItemPress}
              onToggleDarkMode={toggleDarkMode}
              onToggleDoNotDisturb={toggleDoNotDisturb}
              title={text.focusSettings}
              valueOverrides={valueOverrides}
            />
            <SettingSection
              darkMode={darkMode}
              doNotDisturb={doNotDisturb}
              items={appSettings}
              onItemPress={handleItemPress}
              onToggleDarkMode={toggleDarkMode}
              onToggleDoNotDisturb={toggleDoNotDisturb}
              title={text.appSettings}
              valueOverrides={valueOverrides}
            />
            <SettingSection
              darkMode={darkMode}
              doNotDisturb={doNotDisturb}
              items={generalSettings}
              onItemPress={handleItemPress}
              onToggleDarkMode={toggleDarkMode}
              onToggleDoNotDisturb={toggleDoNotDisturb}
              title={text.general}
              valueOverrides={valueOverrides}
            />

            <Pressable
              onPress={() => {
                if (user) {
                  logout();
                }

                router.push('/login');
              }}
              style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
              <ThemedText style={styles.logoutText}>{user ? text.logout : text.login}</ThemedText>
            </Pressable>
            <ThemedText style={styles.footerText}>{text.footer}</ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Palette.paper,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + 125,
    width: '100%',
  },
  content: {
    maxWidth: 430,
    paddingHorizontal: Spacing.three,
    width: '100%',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderColor: Palette.line,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 36,
    minHeight: 94,
    paddingHorizontal: 22,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
  },
  avatarWrap: {
    height: 56,
    marginRight: 22,
    position: 'relative',
    width: 56,
  },
  avatar: {
    backgroundColor: Palette.primary,
    borderRadius: 28,
    height: 56,
    shadowColor: Palette.primaryDark,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    width: 56,
  },
  avatarLeaf: {
    alignItems: 'center',
    backgroundColor: Palette.accent,
    borderColor: Palette.surface,
    borderRadius: 11,
    borderWidth: 2,
    bottom: -2,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    width: 22,
  },
  profileCopy: {
    flex: 1,
  },
  profileName: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  profileLevel: {
    color: Palette.inkSoft,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: Palette.primaryTint,
    borderColor: Palette.line,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusText: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center',
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    color: Palette.inkSoft,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: Palette.surface,
    borderColor: Palette.line,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 60,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingTitle: {
    color: Palette.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 14,
  },
  accessoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  valueText: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    minHeight: 44,
  },
  logoutText: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  footerText: {
    color: Palette.mutedLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
});
