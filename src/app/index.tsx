import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, AvatarMenu } from '@/components/app-header';
import { useAuth } from '@/components/auth-context';
import { useDetox } from '@/components/detox-context';
import { GrowingTree, SeedIcon, SproutIcon } from '@/components/detox-icons';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { elapsedMinutesFor, formatCountdown, formatElapsed, getSeedOption, growthStageIndex, seedNames, TARGET_MINUTES } from '@/constants/seeds';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const copy = {
  ko: {
    checkPhone: '📵 지금 폰 확인하기',
    done: '완성!',
    finish: '오늘 마무리하고 정원에 심기',
    grow: [
      '씨앗이 흙 속에서 조용히 숨쉬고 있어요',
      '여린 줄기가 천천히 뻗어나가고 있어요',
      '거의 다 자랐어요, 조금만 더 견뎌봐요',
    ],
    growSub: [
      '지금 이 시간은 온전히 당신의 것이에요',
      '이대로만 가면 멋진 나무가 될 거예요',
      '곧 완성이에요, 폰은 잠시 잊어도 괜찮아요',
    ],
    idleMsg: '오늘도 잘 지내고 있나요? 잠시 폰을 내려두고, 나만의 시간을 심어봐요.',
    newDay: '새로운 하루 시작하기',
    notCheckedGoal: (min: number) => `목표 ${Math.round(min / 60)}시간 중`,
    notCheckedToday: '오늘 폰 안 본 시간',
    plantSeed: '오늘의 씨앗 심기',
    streakLabel: '연속 기록',
    streakSuffix: '일 연속',
    totalCaption: (n: number) => `누적 ${n}그루`,
    wither: '괜찮아요, 조금 일찍 나무를 살펴봤네요',
    witherCheckedAfter: (elapsed: string) => `(${elapsed}만에 확인함)`,
    witherSub: '자책하지 말아요, 다시 심어보면 돼요.',
  },
  en: {
    checkPhone: '📵 Check phone now',
    done: 'Done!',
    finish: 'Finish today and plant it',
    grow: [
      'The seed is resting quietly in the soil',
      'A tender stem is slowly stretching out',
      'Almost grown — hang in there a little longer',
    ],
    growSub: [
      'This time is entirely your own',
      'Keep this up and it’ll be a wonderful tree',
      'Almost done — it’s okay to forget your phone for now',
    ],
    idleMsg: 'How are you doing today? Put your phone down for a moment and plant some time for yourself.',
    newDay: 'Start a new day',
    notCheckedGoal: (min: number) => `out of ${Math.round(min / 60)}h goal`,
    notCheckedToday: 'Phone-free time today',
    plantSeed: 'Plant today’s seed',
    streakLabel: 'Streak',
    streakSuffix: ' day streak',
    totalCaption: (n: number) => `${n} trees total`,
    wither: 'It’s okay — you checked in on the tree a bit early',
    witherCheckedAfter: (elapsed: string) => `(checked after ${elapsed})`,
    witherSub: 'Don’t be hard on yourself. You can plant again.',
  },
} as const;

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTodayLabel(language: 'ko' | 'en') {
  const now = new Date();
  if (language === 'en') {
    return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 · ${['일', '월', '화', '수', '목', '금', '토'][now.getDay()]}요일`;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { language } = usePreferences();
  const { checkPhone, garden, growthStatus, plantInGarden, selectedSeedId, startedAt, startNewDay, witheredAt } = useDetox();
  const text = copy[language];

  // Ticks once a second while growing so the countdown ring / progress stay live on this screen
  // too (the context's own tick only guarantees `growthStatus` itself is fresh).
  const [nowTick, setNowTick] = useState(() => Date.now());
  useEffect(() => {
    if (growthStatus !== 'growing') {
      return;
    }

    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [growthStatus]);

  const elapsedMinutes = elapsedMinutesFor(startedAt, witheredAt, nowTick);
  const remainingMinutes = Math.max(0, TARGET_MINUTES - elapsedMinutes);
  const progress = Math.min(100, (elapsedMinutes / TARGET_MINUTES) * 100);
  const stageIdx = growthStageIndex(progress);
  const seed = selectedSeedId ? getSeedOption(selectedSeedId) : null;

  const totalTreeCount = garden.filter(entry => entry.status === 'success').length;

  // Consecutive successful days counting back from today — stops at the first missed day.
  const successDates = new Set(garden.filter(entry => entry.status === 'success').map(entry => entry.date));
  let streakCount = 0;
  const cursor = new Date();
  while (successDates.has(dateKey(cursor))) {
    streakCount++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const greeting = user ? { en: 'Welcome back', ko: '오늘도 반가워요' }[language] : { en: 'Home', ko: '홈' }[language];

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader right={<AvatarMenu />} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <ThemedText style={styles.dateLabel}>{formatTodayLabel(language)}</ThemedText>
            <ThemedText style={styles.greeting}>{greeting}</ThemedText>

            <View style={styles.mainCard}>
              {seed ? (
                growthStatus === 'growing' ? (
                  <>
                    <ThemedText style={styles.seedStatus}>{seedNames[language][seed.id]}</ThemedText>

                    <View style={[styles.ring, { backgroundImage: `conic-gradient(${Palette.primary} ${progress}%, ${Palette.ring} 0)` } as object]}>
                      <View style={styles.ringInner}>
                        <ThemedText style={styles.ringValue}>{formatCountdown(remainingMinutes)}</ThemedText>
                      </View>
                    </View>

                    <View style={styles.growBlock}>
                      <ThemedText style={styles.growHeadline}>{text.grow[stageIdx]}</ThemedText>
                      <ThemedText style={styles.growSub}>{text.growSub[stageIdx]}</ThemedText>
                    </View>

                    <View style={styles.treeWrap}>
                      <GrowingTree progress={progress} seedId={seed.id} status="growing" />
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      onPress={checkPhone}
                      style={({ pressed }) => [styles.checkPhoneButton, pressed && styles.pressed]}>
                      <ThemedText style={styles.checkPhoneText}>{text.checkPhone}</ThemedText>
                    </Pressable>
                  </>
                ) : growthStatus === 'done' ? (
                  <>
                    <ThemedText style={styles.seedStatus}>
                      {seedNames[language][seed.id]} · {text.done}
                    </ThemedText>

                    <View style={styles.treeWrap}>
                      <GrowingTree progress={100} seedId={seed.id} status="growing" />
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      onPress={plantInGarden}
                      style={({ pressed }) => [styles.finishButton, pressed && styles.pressed]}>
                      <SeedIcon seedId={seed.id} size={20} />
                      <ThemedText style={styles.finishText}>{text.finish}</ThemedText>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <View style={styles.treeWrap}>
                      <GrowingTree progress={progress} seedId={seed.id} status="withered" />
                    </View>
                    <ThemedText style={styles.witherHeadline}>{text.wither}</ThemedText>
                    <ThemedText style={styles.witherSub}>
                      {text.witherSub} {text.witherCheckedAfter(formatElapsed(elapsedMinutes, language))}
                    </ThemedText>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        startNewDay();
                        router.push('/seed');
                      }}
                      style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                      <ThemedText style={styles.primaryButtonText}>{text.newDay}</ThemedText>
                    </Pressable>
                  </>
                )
              ) : (
                <>
                  <SproutIcon variant="md" animated />
                  <ThemedText style={styles.idleMsg}>{text.idleMsg}</ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      if (!user) {
                        router.push('/login');
                        return;
                      }

                      router.push('/seed');
                    }}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                    <ThemedText style={styles.primaryButtonText}>{text.plantSeed}</ThemedText>
                  </Pressable>
                </>
              )}
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <ThemedText style={styles.statLabel}>{text.streakLabel}</ThemedText>
                <View style={styles.streakRow}>
                  <ThemedText style={styles.statValue}>{streakCount}</ThemedText>
                  <ThemedText style={styles.streakSuffix}>{text.streakSuffix}</ThemedText>
                </View>
                <ThemedText style={styles.totalCaption}>{text.totalCaption(totalTreeCount)}</ThemedText>
              </View>
              <View style={styles.statCard}>
                <ThemedText style={styles.statLabel}>{text.notCheckedToday}</ThemedText>
                <ThemedText style={styles.statValueDark}>{formatElapsed(elapsedMinutes, language)}</ThemedText>
                <ThemedText style={styles.totalCaption}>{text.notCheckedGoal(TARGET_MINUTES)}</ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
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
    paddingBottom: BottomTabInset + 90,
    width: '100%',
  },
  content: {
    maxWidth: 430,
    paddingHorizontal: Spacing.three,
    paddingTop: 4,
    width: '100%',
  },
  dateLabel: {
    color: Palette.textSoft,
    fontSize: 13,
  },
  greeting: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 22,
    marginTop: 4,
  },
  mainCard: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 20,
    marginTop: 22,
    padding: 22,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  seedStatus: {
    color: Palette.textSoft,
    fontSize: 13,
  },
  ring: {
    alignItems: 'center',
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    marginTop: 14,
    width: 96,
  },
  ringInner: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  ringValue: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 15,
  },
  idleMsg: {
    color: Palette.text,
    fontSize: 13.5,
    lineHeight: 21,
    marginTop: 14,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 46,
    paddingHorizontal: 26,
    shadowColor: 'rgba(123,174,127,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts?.display,
    fontSize: 14,
  },
  treeWrap: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 14,
    width: '100%',
  },
  checkPhoneButton: {
    alignItems: 'center',
    borderColor: Palette.wither,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 18,
    width: '100%',
  },
  checkPhoneText: {
    color: Palette.wither,
    fontSize: 12.5,
  },
  finishButton: {
    alignItems: 'center',
    backgroundColor: Palette.primaryDark,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 20,
    shadowColor: 'rgba(95,143,99,0.4)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 18,
    width: '100%',
  },
  finishText: {
    color: '#FFFFFF',
    fontFamily: Fonts?.display,
    fontSize: 14.5,
  },
  witherHeadline: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  witherSub: {
    color: Palette.textSoft,
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
  },
  growBlock: {
    marginTop: 16,
    width: '100%',
  },
  growHeadline: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 14.5,
    textAlign: 'center',
  },
  growSub: {
    color: Palette.textSoft,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    flex: 1,
    padding: 16,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  statLabel: {
    color: Palette.textSoft,
    fontSize: 11.5,
  },
  statValue: {
    color: Palette.primaryDark,
    fontFamily: Fonts?.display,
    fontSize: 20,
  },
  streakRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  streakSuffix: {
    color: Palette.textSoft,
    fontSize: 12,
  },
  totalCaption: {
    color: Palette.textSoft,
    fontSize: 11,
    marginTop: 4,
  },
  statValueDark: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 20,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.82,
  },
});
