import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, AvatarMenu } from '@/components/app-header';
import { useDetox } from '@/components/detox-context';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { elapsedMinutesFor, formatElapsed, TARGET_MINUTES } from '@/constants/seeds';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const weekDayLabels = {
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
} as const;

const statusLabels = {
  ko: { growing: '자라는 중', done: '완성', withered: '시듦', idle: '대기' },
  en: { growing: 'Growing', done: 'Done', withered: 'Withered', idle: 'Waiting' },
} as const;

const copy = {
  ko: {
    last7Days: '최근 7일 (폰 안 본 시간)',
    subtitle: '폰을 안 볼수록 정원이 무성해져요',
    title: '핸드폰 사용량',
    todayNotChecked: '오늘 폰 안 본 시간',
    treeStatus: '오늘 나무 상태',
  },
  en: {
    last7Days: 'Last 7 days (phone-free time)',
    subtitle: 'The less you check your phone, the fuller your garden grows',
    title: 'Phone Usage',
    todayNotChecked: 'Phone-free time today',
    treeStatus: 'Today’s tree',
  },
} as const;

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function StatsScreen() {
  const { language } = usePreferences();
  const { garden, growthStatus, startedAt, witheredAt } = useDetox();
  const text = copy[language];
  const elapsedMinutes = elapsedMinutesFor(startedAt, witheredAt, Date.now());
  const elapsedLabel = formatElapsed(elapsedMinutes, language);

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });

  const weekBars = last7Days.map(date => {
    const isToday = dateKey(date) === dateKey(today);
    const entry = garden.find(g => g.date === dateKey(date));
    const minutes = isToday ? elapsedMinutes : (entry?.elapsedMinutes ?? 0);

    return {
      key: dateKey(date),
      isToday,
      minutes,
      label: weekDayLabels[language][date.getDay()],
    };
  });

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader right={<AvatarMenu />} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>{text.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{text.subtitle}</ThemedText>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>{text.todayNotChecked}</ThemedText>
                <ThemedText style={styles.summaryValue}>{elapsedLabel}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>{text.treeStatus}</ThemedText>
                <ThemedText style={styles.summaryValueDark}>{statusLabels[language][growthStatus]}</ThemedText>
              </View>
            </View>

            <View style={styles.chartCard}>
              <ThemedText style={styles.chartLabel}>{text.last7Days}</ThemedText>
              <View style={styles.chartBars}>
                {weekBars.map(bar => (
                  <View key={bar.key} style={styles.dayColumn}>
                    <View
                      style={[
                        styles.bar,
                        { height: Math.max(6, (Math.min(bar.minutes, TARGET_MINUTES) / TARGET_MINUTES) * 100) },
                        bar.isToday && styles.barToday,
                      ]}
                    />
                    <ThemedText style={[styles.dayLabel, bar.isToday && styles.dayLabelToday]}>{bar.label}</ThemedText>
                  </View>
                ))}
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
  title: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 20,
  },
  subtitle: {
    color: Palette.textSoft,
    fontSize: 13,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: Palette.surface,
    borderRadius: 18,
    gap: 10,
    marginTop: 18,
    padding: 18,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  summaryRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: Palette.textSoft,
    fontSize: 12,
  },
  summaryValue: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 22,
  },
  summaryValueDark: {
    color: Palette.primaryDark,
    fontFamily: Fonts?.display,
    fontSize: 16,
  },
  chartCard: {
    backgroundColor: Palette.surface,
    borderRadius: 18,
    marginTop: 16,
    padding: 18,
    paddingBottom: 12,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  chartLabel: {
    color: Palette.textSoft,
    fontSize: 12,
    marginBottom: 14,
  },
  chartBars: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    height: 110,
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: Palette.ring,
    borderRadius: 6,
    width: '70%',
  },
  barToday: {
    backgroundColor: Palette.primary,
  },
  dayLabel: {
    color: Palette.textSoft,
    fontSize: 10,
  },
  dayLabelToday: {
    color: Palette.text,
    fontWeight: '700',
  },
});
