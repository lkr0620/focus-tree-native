import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { PanResponder, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { useAuth } from '@/components/auth-context';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const seedOptions = [
  {
    name: '삼나무',
    uri: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=220&h=220&fit=crop',
    selected: false,
  },
  {
    name: '단풍나무',
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=220&h=220&fit=crop',
    selected: true,
  },
  {
    name: '분재',
    uri: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=220&h=220&fit=crop',
    selected: false,
  },
] as const;

const timeMarks = ['10m', '45m', '80m', '120m'] as const;
const minMinutes = 10;
const maxMinutes = 120;
const pauseHeroImage = 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=420&h=420&fit=crop';
type SeedName = (typeof seedOptions)[number]['name'];

const homeCopy = {
  ko: {
    complete: '집중을 완료했어요',
    completeSubtitle: '오늘의 숨결이 숲 어딘가에 뿌리를 내렸어요.',
    completeTitle: '숨을 다 골랐어요',
    completeViewForest: '내 숲 보러 가기',
    completeAgain: '다시 숨 고르기',
    cta: '숨 고르기 시작',
    forest: '홈으로 돌아가기',
    footnote: '네트워크 연결 상태가 잠시 불안정할 수 있습니다.',
    pause: '잠시 멈춤',
    pauseSubtitle: '괜찮아요, 다시 숨을 고르면 돼요.',
    pauseTitle: '숨이 잠시 멈췄어요',
    resume: '다시 시작하기',
    seedLabel: '심을 씨앗을 고르세요',
    sessionTitle: '지금 이 순간의 숨에 집중하세요.',
    subtitle: '작은 멈춤이 나를 지키는 습관이 됩니다.',
    title: '숨을 고르면 마음도 자라나요',
    unit: '분',
  },
  en: {
    complete: 'Focus complete',
    completeSubtitle: 'Today’s breath has taken root somewhere in your forest.',
    completeTitle: 'You caught your breath',
    completeViewForest: 'View My Forest',
    completeAgain: 'Choose Again',
    cta: 'Start Breathing',
    forest: 'Back Home',
    footnote: 'Your network connection may be briefly unstable.',
    pause: 'Pause',
    pauseSubtitle: 'It is okay. You can return to your breath.',
    pauseTitle: 'Your breath is paused',
    resume: 'Start Again',
    seedLabel: 'Choose a seed to plant',
    sessionTitle: 'Focus on this breath, right now.',
    subtitle: 'A small pause can become a habit that protects you.',
    title: 'When breath settles, the heart grows',
    unit: 'min',
  },
} as const;

const seedNames = {
  ko: {
    단풍나무: '단풍나무',
    분재: '분재',
    삼나무: '삼나무',
  },
  en: {
    단풍나무: 'Maple',
    분재: 'Bonsai',
    삼나무: 'Cedar',
  },
} as const;

export default function HomeScreen() {
  const { user } = useAuth();
  const { language } = usePreferences();
  const text = homeCopy[language];
  const [selectedSeed, setSelectedSeed] = useState<SeedName>(
    seedOptions.find(seed => seed.selected)?.name ?? seedOptions[0].name
  );
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [sliderWidth, setSliderWidth] = useState(1);
  const [isBreathing, setIsBreathing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);

  const selectedSeedOption = seedOptions.find(seed => seed.name === selectedSeed) ?? seedOptions[0];
  const sliderProgress = (selectedMinutes - minMinutes) / (maxMinutes - minMinutes);
  const progressDegrees = sliderProgress * 360;
  const sessionDurationSeconds = selectedMinutes * 60;
  const sessionProgress = Math.max(remainingSeconds / sessionDurationSeconds, 0);
  const sessionProgressDegrees = sessionProgress * 360;
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingDisplaySeconds = remainingSeconds % 60;
  const remainingTimeText = `${remainingMinutes}:${String(remainingDisplaySeconds).padStart(2, '0')}`;
  const sliderResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: event => {
          const progress = Math.min(Math.max(event.nativeEvent.locationX / sliderWidth, 0), 1);
          setSelectedMinutes(Math.round(minMinutes + progress * (maxMinutes - minMinutes)));
        },
        onPanResponderMove: event => {
          const progress = Math.min(Math.max(event.nativeEvent.locationX / sliderWidth, 0), 1);
          setSelectedMinutes(Math.round(minMinutes + progress * (maxMinutes - minMinutes)));
        },
      }),
    [sliderWidth]
  );

  const adjustSelectedMinutes = (delta: number) => {
    setSelectedMinutes(current => Math.min(maxMinutes, Math.max(minMinutes, current + delta)));
  };

  useEffect(() => {
    if (!isBreathing || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(current => {
        if (current <= 1) {
          clearInterval(timer);
          setIsBreathing(false);
          setIsPaused(false);
          setIsComplete(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathing, isPaused]);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AppHeader
            onRightPress={isPaused ? () => setIsPaused(false) : undefined}
            rightButtonTone={isPaused ? 'soft' : 'plain'}
            rightIcon={isPaused ? { ios: 'xmark', android: 'close', web: 'close' } : { ios: 'person.circle', android: 'account_circle', web: 'account_circle' }}
            rightIconColor={isPaused ? Palette.ink : Palette.ink}
            rightIconSize={isPaused ? 20 : 24}
          />

          <View style={styles.content}>
            {isPaused ? (
              <View style={styles.pausedContent}>
                <View style={styles.pauseImageHalo}>
                  <Image source={{ uri: pauseHeroImage }} style={styles.pauseHeroImage} contentFit="cover" />
                </View>

                <View style={styles.pauseCopy}>
                  <ThemedText style={styles.pauseTitle}>{text.pauseTitle}</ThemedText>
                  <ThemedText style={styles.pauseSubtitle}>{text.pauseSubtitle}</ThemedText>
                </View>

                <View style={styles.pauseActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setIsPaused(false)}
                    style={({ pressed }) => [styles.resumeButton, pressed && styles.pressed]}>
                    <SymbolView name={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }} tintColor={Palette.goldSoft} size={16} />
                    <ThemedText style={styles.resumeText}>{text.resume}</ThemedText>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setIsBreathing(false);
                      setIsPaused(false);
                    }}
                    style={({ pressed }) => [styles.forestButton, pressed && styles.pressed]}>
                    <SymbolView name={{ ios: 'tree', android: 'forest', web: 'park' }} tintColor={Palette.primary} size={16} />
                    <ThemedText style={styles.forestText}>{text.forest}</ThemedText>
                  </Pressable>
                </View>

                <ThemedText style={styles.pauseFootnote}>{text.footnote}</ThemedText>
              </View>
            ) : isBreathing ? (
              <View style={styles.sessionContent}>
                <View style={styles.sessionTimerWrap}>
                  <View style={styles.sessionTimeBadge}>
                    <SymbolView name={{ ios: 'stopwatch', android: 'timer', web: 'timer' }} tintColor={Palette.muted} size={16} />
                    <ThemedText style={styles.sessionTimeText}>{remainingTimeText}</ThemedText>
                  </View>

                  <View style={styles.sessionCircleShadow}>
                    <View style={styles.sessionCircle}>
                      <View style={styles.sessionTrackRing} />
                      <View
                        style={[
                          styles.sessionProgressRing,
                          {
                            backgroundImage: `conic-gradient(from 0deg, ${Palette.gold} 0deg ${sessionProgressDegrees}deg, transparent ${sessionProgressDegrees}deg 360deg)`,
                          } as object,
                        ]}
                      />
                      <Image source={{ uri: selectedSeedOption.uri }} style={styles.sessionPlantImage} contentFit="cover" />
                    </View>
                  </View>
                </View>

                <ThemedText style={styles.sessionTitle}>{text.sessionTitle}</ThemedText>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsPaused(true)}
                  style={({ pressed }) => [styles.pauseButton, pressed && styles.pressed]}>
                  <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} tintColor={Palette.inkSoft} size={15} />
                  <ThemedText style={styles.pauseText}>{text.pause}</ThemedText>
                </Pressable>
              </View>
            ) : isComplete ? (
              <View style={styles.pausedContent}>
                <View style={styles.pauseImageHalo}>
                  <Image source={{ uri: selectedSeedOption.uri }} style={styles.pauseHeroImage} contentFit="cover" />
                </View>

                <View style={styles.pauseCopy}>
                  <View style={styles.completeBadge}>
                    <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor={Palette.goldSoft} size={13} />
                    <ThemedText style={styles.completeBadgeText}>{text.complete}</ThemedText>
                  </View>
                  <ThemedText style={styles.pauseTitle}>{text.completeTitle}</ThemedText>
                  <ThemedText style={styles.pauseSubtitle}>{text.completeSubtitle}</ThemedText>
                </View>

                <View style={styles.pauseActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setIsComplete(false);
                      router.push('/explore');
                    }}
                    style={({ pressed }) => [styles.resumeButton, pressed && styles.pressed]}>
                    <SymbolView name={{ ios: 'tree', android: 'forest', web: 'park' }} tintColor={Palette.goldSoft} size={16} />
                    <ThemedText style={styles.resumeText}>{text.completeViewForest}</ThemedText>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setIsComplete(false)}
                    style={({ pressed }) => [styles.forestButton, pressed && styles.pressed]}>
                    <ThemedText style={styles.forestText}>{text.completeAgain}</ThemedText>
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.heroCopy}>
                  <ThemedText style={styles.title}>{text.title}</ThemedText>
                  <ThemedText style={styles.subtitle}>{text.subtitle}</ThemedText>
                </View>

                <View style={styles.timerWrap}>
                  <View style={styles.timerShadow}>
                    <View style={styles.timerCircle}>
                      <View style={styles.timerTrackRing} />
                      <View
                        style={[
                          styles.timerProgressRing,
                          {
                            backgroundImage: `conic-gradient(from 0deg, ${Palette.primary} 0deg ${progressDegrees}deg, transparent ${progressDegrees}deg 360deg)`,
                          } as object,
                        ]}
                      />
                      <View style={styles.timerInnerDisk}>
                        <ThemedText style={styles.timerValue}>{selectedMinutes}</ThemedText>
                        <ThemedText style={styles.timerUnit}>{text.unit}</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.sliderBlock}>
                  <View
                    accessibilityActions={[
                      { name: 'increment', label: 'increment' },
                      { name: 'decrement', label: 'decrement' },
                    ]}
                    accessibilityRole="adjustable"
                    accessibilityValue={{ min: minMinutes, max: maxMinutes, now: selectedMinutes }}
                    onAccessibilityAction={event => {
                      if (event.nativeEvent.actionName === 'increment') {
                        adjustSelectedMinutes(5);
                      } else if (event.nativeEvent.actionName === 'decrement') {
                        adjustSelectedMinutes(-5);
                      }
                    }}
                    onLayout={event => setSliderWidth(event.nativeEvent.layout.width)}
                    style={styles.sliderTouchArea}
                    {...sliderResponder.panHandlers}>
                    <View style={styles.sliderTrack}>
                      <View style={[styles.sliderFill, { width: `${sliderProgress * 100}%` }]} />
                      <View style={[styles.sliderKnob, { left: `${sliderProgress * 100}%` }]} />
                    </View>
                  </View>
                  <View style={styles.timeRow}>
                    {timeMarks.map(mark => (
                      <ThemedText key={mark} style={styles.timeMark}>
                        {mark}
                      </ThemedText>
                    ))}
                  </View>
                </View>

                <ThemedText style={styles.sectionTitle}>{text.seedLabel}</ThemedText>

                <View style={styles.seedRow}>
                  {seedOptions.map(seed => {
                    const isSelected = selectedSeed === seed.name;

                    return (
                      <Pressable
                        key={seed.name}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => setSelectedSeed(seed.name)}
                        style={({ pressed }) => [styles.seedCard, isSelected && styles.seedCardSelected, pressed && styles.pressed]}>
                        <Image source={{ uri: seed.uri }} style={styles.seedImage} contentFit="cover" />
                        <ThemedText style={styles.seedName}>{seedNames[language][seed.name]}</ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    if (!user) {
                      router.push('/login');
                      return;
                    }

                    setRemainingSeconds(selectedMinutes * 60);
                    setIsBreathing(true);
                    setIsPaused(false);
                  }}
                  style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}>
                  <ThemedText style={styles.ctaText}>{text.cta}</ThemedText>
                  <SymbolView name={{ ios: 'wind', android: 'air', web: 'air' }} tintColor={Palette.goldSoft} size={23} />
                </Pressable>
              </>
            )}
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
  heroCopy: {
    alignItems: 'center',
    marginBottom: 38,
  },
  title: {
    color: Palette.ink,
    fontFamily: Fonts?.serif,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 37,
    maxWidth: 340,
    textAlign: 'center',
  },
  subtitle: {
    color: Palette.inkSoft,
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 22,
    marginTop: 14,
    textAlign: 'center',
  },
  sessionContent: {
    alignItems: 'center',
  },
  sessionTimerWrap: {
    alignItems: 'center',
    marginBottom: 70,
  },
  sessionTimeBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
    zIndex: 2,
  },
  sessionTimeText: {
    color: Palette.muted,
    fontSize: 17,
    fontWeight: '700',
  },
  sessionCircleShadow: {
    borderRadius: 143,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
  },
  sessionCircle: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 143,
    height: 286,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 286,
  },
  sessionTrackRing: {
    borderColor: Palette.line,
    borderRadius: 143,
    borderWidth: 5,
    height: 286,
    position: 'absolute',
    width: 286,
  },
  sessionProgressRing: {
    borderRadius: 143,
    height: 286,
    position: 'absolute',
    width: 286,
  },
  sessionPlantImage: {
    borderRadius: 132,
    height: 264,
    width: 264,
  },
  sessionTitle: {
    color: Palette.ink,
    fontFamily: Fonts?.serif,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 33,
    marginBottom: 16,
    textAlign: 'center',
  },
  pauseButton: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderColor: Palette.line,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    minHeight: 44,
    paddingHorizontal: 28,
  },
  pauseText: {
    color: Palette.inkSoft,
    fontSize: 14,
    fontWeight: '700',
  },
  pausedContent: {
    alignItems: 'center',
    minHeight: 560,
    paddingBottom: 34,
    paddingTop: 4,
  },
  pauseImageHalo: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderColor: Palette.surface,
    borderRadius: 86,
    borderWidth: 3,
    height: 172,
    justifyContent: 'center',
    marginBottom: 42,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.12,
    shadowRadius: 34,
    width: 172,
  },
  pauseHeroImage: {
    borderRadius: 80,
    height: 160,
    width: 160,
  },
  pauseCopy: {
    alignItems: 'center',
    marginBottom: 40,
  },
  completeBadge: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  completeBadgeText: {
    color: Palette.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pauseTitle: {
    color: Palette.ink,
    fontFamily: Fonts?.serif,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    textAlign: 'center',
  },
  pauseSubtitle: {
    color: Palette.inkSoft,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    marginTop: 14,
    textAlign: 'center',
  },
  pauseActions: {
    alignItems: 'center',
    gap: 14,
    marginBottom: 38,
    width: '100%',
  },
  resumeButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: Palette.primaryDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    width: '74%',
  },
  resumeText: {
    color: Palette.goldSoft,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  forestButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.surface,
    borderColor: Palette.primary,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    width: '74%',
  },
  forestText: {
    color: Palette.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  pauseFootnote: {
    color: Palette.mutedLight,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
  timerWrap: {
    alignItems: 'center',
    marginBottom: 46,
  },
  timerShadow: {
    borderRadius: 126,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 19 },
    shadowOpacity: 0.12,
    shadowRadius: 27,
  },
  timerCircle: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 120,
    height: 240,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 240,
  },
  timerTrackRing: {
    borderColor: Palette.line,
    borderRadius: 120,
    borderWidth: 5,
    height: 240,
    position: 'absolute',
    width: 240,
  },
  timerProgressRing: {
    borderRadius: 120,
    height: 240,
    position: 'absolute',
    width: 240,
  },
  timerInnerDisk: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: 112,
    height: 224,
    justifyContent: 'center',
    width: 224,
  },
  timerValue: {
    color: Palette.primary,
    fontFamily: Fonts?.serif,
    fontSize: 46,
    fontWeight: '400',
    lineHeight: 52,
  },
  timerUnit: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sliderBlock: {
    marginBottom: 36,
  },
  sliderTouchArea: {
    height: 34,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  sliderTrack: {
    backgroundColor: Palette.line,
    borderRadius: 999,
    height: 6,
    justifyContent: 'center',
    overflow: 'visible',
  },
  sliderFill: {
    backgroundColor: Palette.primary,
    borderRadius: 999,
    height: 6,
    left: 0,
    position: 'absolute',
  },
  sliderKnob: {
    backgroundColor: Palette.primary,
    borderColor: Palette.surface,
    borderRadius: 13,
    borderWidth: 4,
    height: 26,
    position: 'absolute',
    transform: [{ translateX: -13 }],
    width: 26,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 19,
  },
  timeMark: {
    color: Palette.mutedLight,
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    color: Palette.inkSoft,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 21,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  seedRow: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    marginBottom: 43,
  },
  seedCard: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderColor: Palette.line,
    borderRadius: 11,
    borderWidth: 1.5,
    flex: 1,
    maxWidth: 98,
    minHeight: 124,
    paddingHorizontal: 10,
    paddingTop: 18,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  seedCardSelected: {
    backgroundColor: Palette.primaryTint,
    borderColor: Palette.gold,
    shadowOpacity: 0.1,
  },
  seedImage: {
    borderRadius: 28,
    height: 56,
    marginBottom: 14,
    width: 56,
  },
  seedName: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  ctaButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 31,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 60,
    shadowColor: Palette.primaryDeep,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    width: '92%',
  },
  ctaText: {
    color: Palette.goldSoft,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  pressed: {
    opacity: 0.82,
  },
});
