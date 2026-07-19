import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, AvatarMenu, BackHeaderRow } from '@/components/app-header';
import { useDetox } from '@/components/detox-context';
import { SeedIcon } from '@/components/detox-icons';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { getSeedOption, seedNames, TARGET_MINUTES } from '@/constants/seeds';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const copy = {
  ko: {
    rule1: '폰을 보지 않고 기다리면 ',
    rule1Bold: '나무가 쑥쑥',
    rule1End: ' 자라요',
    rule2: '중간에 ',
    rule2Bold: '폰을 확인하면',
    rule2End: ' 나무가 시들어요',
    start: '지금 시작하기',
    subtitle: '폰을 안 볼수록 나무가 튼튼하게 자라요',
    summary: (seed: string) => `${seed} 씨앗을 심고 2시간 동안 폰을 내려놓아요`,
    timerCaption: '이 시간 동안 폰 화면을 켜지 않으면 나무가 완성돼요',
    title: '규칙을 확인해요',
  },
  en: {
    rule1: 'Wait without checking your phone and ',
    rule1Bold: 'the tree grows fast',
    rule1End: '',
    rule2: 'Check your phone partway through and ',
    rule2Bold: 'it withers',
    rule2End: '',
    start: 'Start now',
    subtitle: 'The less you check your phone, the sturdier the tree grows',
    summary: (seed: string) => `Plant the ${seed} seed and put your phone down for 2 hours`,
    timerCaption: 'Keep your phone screen off for this long and the tree finishes growing',
    title: 'Check the rules',
  },
} as const;

export default function GoalScreen() {
  const { language } = usePreferences();
  const { selectedSeedId, startGrowing } = useDetox();
  const text = copy[language];
  const seed = selectedSeedId ? getSeedOption(selectedSeedId) : null;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader right={<AvatarMenu />} />
        <BackHeaderRow onBack={() => router.back()} subtitle={text.subtitle} title={text.title} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.timerCard}>
              <ThemedText style={styles.timerValue}>{Math.floor(TARGET_MINUTES / 60)}:{String(TARGET_MINUTES % 60).padStart(2, '0')}:00</ThemedText>
              <ThemedText style={styles.timerCaption}>{text.timerCaption}</ThemedText>
            </View>

            <View style={styles.rulesCard}>
              <View style={styles.ruleRow}>
                <View style={[styles.ruleDot, { backgroundColor: Palette.primary }]} />
                <ThemedText style={styles.ruleText}>
                  {text.rule1}
                  <ThemedText style={styles.ruleBold}>{text.rule1Bold}</ThemedText>
                  {text.rule1End}
                </ThemedText>
              </View>
              <View style={styles.ruleRow}>
                <View style={[styles.ruleDot, { backgroundColor: Palette.wither }]} />
                <ThemedText style={styles.ruleText}>
                  {text.rule2}
                  <ThemedText style={styles.ruleBold}>{text.rule2Bold}</ThemedText>
                  {text.rule2End}
                </ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {seed ? (
            <View style={styles.summaryCard}>
              <SeedIcon seedId={seed.id} size={34} />
              <ThemedText style={styles.summaryText}>{text.summary(seedNames[language][seed.id])}</ThemedText>
            </View>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              startGrowing();
              router.push('/');
            }}
            style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
            <ThemedText style={styles.startText}>{text.start}</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Palette.bg,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    width: '100%',
  },
  content: {
    maxWidth: 430,
    paddingHorizontal: Spacing.three,
    paddingTop: 18,
    width: '100%',
  },
  timerCard: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 18,
    padding: 20,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
  },
  timerValue: {
    color: Palette.primaryDark,
    fontFamily: Fonts?.display,
    fontSize: 32,
  },
  timerCaption: {
    color: Palette.textSoft,
    fontSize: 12.5,
    marginTop: 6,
    textAlign: 'center',
  },
  rulesCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    gap: 10,
    marginTop: 16,
    padding: 16,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
  },
  ruleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  ruleDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  ruleText: {
    color: Palette.text,
    flex: 1,
    fontSize: 12.5,
  },
  ruleBold: {
    fontWeight: '700',
  },
  footer: {
    backgroundColor: Palette.bg,
    paddingBottom: BottomTabInset > 0 ? 20 : 24,
    paddingHorizontal: Spacing.three,
    paddingTop: 8,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    padding: 14,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
  },
  summaryText: {
    color: Palette.text,
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  startButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 16,
    justifyContent: 'center',
    maxWidth: 430,
    minHeight: 56,
    shadowColor: 'rgba(123,174,127,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    width: '100%',
  },
  startText: {
    color: '#FFFFFF',
    fontFamily: Fonts?.display,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.82,
  },
});
