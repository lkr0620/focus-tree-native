import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const weekDays = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  ko: ['월', '화', '수', '목', '금', '토', '일'],
} as const;
const growthItems = [
  { name: { en: 'Cedar', ko: 'Cedar(삼나무)' }, stage: { en: '3 trees grown', ko: '3그루 성장' }, minutes: '180m', tone: Palette.primaryTint, icon: Palette.primary },
  { name: { en: 'Maple', ko: 'Maple(단풍나무)' }, stage: { en: '2 trees grown', ko: '2그루 성장' }, minutes: '120m', tone: Palette.goldSoft, icon: Palette.goldDeep },
  { name: { en: 'Willow', ko: 'Willow(버드나무)' }, stage: { en: '1 tree grown', ko: '1그루 성장' }, minutes: '60m', tone: Palette.surfaceSoft, icon: Palette.inkSoft },
] as const;
const heatmap = [
  ['rgba(31,61,46,0.08)', 'rgba(31,61,46,0.14)', 'rgba(31,61,46,0.22)', 'rgba(31,61,46,0.34)', 'rgba(31,61,46,0.55)'],
  ['rgba(31,61,46,0.05)', 'rgba(31,61,46,0.09)', 'rgba(31,61,46,0.16)', 'rgba(31,61,46,0.24)', 'rgba(31,61,46,0.34)'],
] as const;

function DonutChart() {
  return (
    <View style={styles.donutWrap}>
      <View style={styles.donutBase} />
      <View style={styles.donutHole} />
    </View>
  );
}

function WeeklyChart() {
  const { language } = usePreferences();

  return (
    <View style={styles.weekChart}>
      <View style={styles.bestBadge}>
        <ThemedText style={styles.bestText}>Best</ThemedText>
      </View>
      <View style={styles.chartBars}>
        {weekDays[language].map((day, index) => (
          <View key={day} style={styles.dayColumn}>
            <View style={[styles.bar, index === 3 && styles.bestBar, { height: [28, 36, 48, 76, 42, 31, 22][index] }]} />
            <ThemedText style={[styles.dayLabel, index === 3 && styles.bestDayLabel]}>{day}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

function GrowthRow({ item }: { item: (typeof growthItems)[number] }) {
  const { language } = usePreferences();

  return (
    <View style={styles.growthRow}>
      <View style={[styles.treeBadge, { backgroundColor: item.tone }]}>
        <SymbolView name={{ ios: 'tree.fill', android: 'forest', web: 'park' }} tintColor={item.icon} size={22} />
      </View>
      <View style={styles.growthCopy}>
        <ThemedText style={styles.growthName}>{item.name[language]}</ThemedText>
        <ThemedText style={styles.growthStage}>{item.stage[language]}</ThemedText>
      </View>
      <ThemedText style={styles.growthMinutes}>{item.minutes}</ThemedText>
    </View>
  );
}

function FocusHeatmap() {
  const { language } = usePreferences();
  const labels = {
    en: { high: 'High', low: 'Low', weekday: 'Weekday', weekend: 'Weekend' },
    ko: { high: '높음', low: '낮음', weekday: '주중', weekend: '주말' },
  }[language];

  return (
    <View style={styles.heatmapWrap}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: 'rgba(31,61,46,0.1)' }]} />
          <ThemedText style={styles.legendText}>{labels.low}</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: Palette.primary }]} />
          <ThemedText style={styles.legendText}>{labels.high}</ThemedText>
        </View>
      </View>
      <View style={styles.timeLabels}>
        <ThemedText style={styles.timeLabel}>00</ThemedText>
        <ThemedText style={styles.timeLabel}>04</ThemedText>
        <ThemedText style={styles.timeLabel}>08</ThemedText>
      </View>
      {heatmap.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.heatmapRow}>
          <ThemedText style={styles.rowTime}>{rowIndex === 0 ? labels.weekday : labels.weekend}</ThemedText>
          {row.map((color, index) => (
            <View key={`${rowIndex}-${index}`} style={[styles.heatCell, { backgroundColor: color }]} />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function StatsScreen() {
  const { language } = usePreferences();
  const text = {
    en: {
      delta: '↗ 15% more than last week.',
      focusTime: 'Focus Time',
      growthReport: 'Growth Report',
      heatmapBody: 'Your deepest focus usually appears between 9 AM and 11 AM.',
      quote: 'Records are quiet proof of how deeply we have breathed.',
      subtitle: 'Look back on the quiet moments you stayed with yourself.',
      title: 'Breath Records',
      total: '12h 45m',
      weekly: 'Weekly Focus Report',
      weeklyTotal: 'Total focus time this week',
    },
    ko: {
      delta: '↗ 지난주보다 15% 증가했습니다.',
      focusTime: '집중 시간대',
      growthReport: '성장 리포트',
      heatmapBody: '주로 오전 9시에서 11시 사이에 가장 높은 몰입도를 보입니다.',
      quote: '기록은 우리가 얼마나 깊게 숨을 쉬었는지 보여주는 고요한 증거입니다.',
      subtitle: '당신이 머문 고요의 시간들을 돌아봅니다.',
      title: '숨결의 기록',
      total: '12시간 45분',
      weekly: '주간 집중 리포트',
      weeklyTotal: '이번 주 총 집중 시간',
    },
  }[language];

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AppHeader />

          <View style={styles.content}>
            <View style={styles.heroCopy}>
              <ThemedText style={styles.kicker}>{text.title}</ThemedText>
              <ThemedText style={styles.subtitle}>{text.subtitle}</ThemedText>
            </View>

            <View style={styles.summaryCard}>
              <View>
                <ThemedText style={styles.cardLabel}>{text.weeklyTotal}</ThemedText>
                <ThemedText style={styles.bigNumber}>{text.total}</ThemedText>
                <ThemedText style={styles.deltaText}>{text.delta}</ThemedText>
              </View>
              <DonutChart />
            </View>

            <View style={styles.panel}>
              <View style={styles.panelHeader}>
                <ThemedText style={styles.panelTitle}>{text.weekly}</ThemedText>
                <SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} tintColor={Palette.gold} size={20} />
              </View>
              <WeeklyChart />
            </View>

            <View style={styles.panel}>
              <ThemedText style={styles.panelTitle}>{text.growthReport}</ThemedText>
              <View style={styles.growthList}>
                {growthItems.map(item => (
                  <GrowthRow key={item.name.en} item={item} />
                ))}
              </View>
            </View>

            <View style={styles.panel}>
              <ThemedText style={styles.panelTitle}>{text.focusTime}</ThemedText>
              <ThemedText style={styles.panelBody}>{text.heatmapBody}</ThemedText>
              <FocusHeatmap />
            </View>

            <View style={styles.quoteBlock}>
              <ThemedText style={styles.quoteMark}>”</ThemedText>
              <ThemedText style={styles.quoteText}>{text.quote}</ThemedText>
              <View style={styles.quoteLine} />
            </View>
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
    marginBottom: 28,
  },
  kicker: {
    color: Palette.ink,
    fontFamily: Fonts?.serif,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 29,
  },
  subtitle: {
    color: Palette.inkSoft,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 5,
  },
  summaryCard: {
    backgroundColor: Palette.surface,
    borderColor: Palette.line,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    minHeight: 138,
    overflow: 'hidden',
    paddingHorizontal: 30,
    paddingVertical: 28,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
  },
  cardLabel: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  bigNumber: {
    color: Palette.primary,
    fontFamily: Fonts?.serif,
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 38,
  },
  deltaText: {
    color: Palette.goldDeep,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 20,
  },
  donutWrap: {
    height: 82,
    position: 'relative',
    width: 82,
  },
  donutBase: {
    backgroundColor: Palette.primaryTint,
    borderRadius: 41,
    height: 82,
    width: 82,
  },
  donutHole: {
    backgroundColor: Palette.surface,
    borderRadius: 27,
    height: 54,
    left: 14,
    position: 'absolute',
    top: 14,
    width: 54,
  },
  panel: {
    backgroundColor: Palette.surface,
    borderColor: Palette.line,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 32,
    minHeight: 176,
    padding: 24,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  weekChart: {
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: 146,
    paddingTop: 24,
  },
  bestBadge: {
    alignSelf: 'center',
    backgroundColor: Palette.ink,
    borderRadius: 3,
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bestText: {
    color: Palette.goldSoft,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  chartBars: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 8,
    width: 22,
  },
  bar: {
    backgroundColor: Palette.surfaceSoft,
    borderRadius: 3,
    width: 12,
  },
  bestBar: {
    backgroundColor: Palette.gold,
  },
  dayLabel: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  bestDayLabel: {
    color: Palette.ink,
    fontWeight: '700',
  },
  growthList: {
    gap: 18,
    marginTop: 20,
  },
  growthRow: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderRadius: 10,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: 14,
  },
  treeBadge: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 18,
    width: 44,
  },
  growthCopy: {
    flex: 1,
  },
  growthName: {
    color: Palette.ink,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  growthStage: {
    color: Palette.inkSoft,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  growthMinutes: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  panelBody: {
    color: Palette.inkSoft,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 14,
  },
  heatmapWrap: {
    marginTop: 20,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  legendSwatch: {
    height: 8,
    width: 8,
  },
  legendText: {
    color: Palette.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  timeLabels: {
    flexDirection: 'row',
    gap: 69,
    marginBottom: 6,
    marginLeft: 48,
  },
  timeLabel: {
    color: Palette.mutedLight,
    fontSize: 9,
    fontWeight: '600',
  },
  heatmapRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 5,
  },
  rowTime: {
    color: Palette.inkSoft,
    fontSize: 10,
    fontWeight: '700',
    marginRight: 12,
    width: 28,
  },
  heatCell: {
    height: 18,
    width: 33,
  },
  quoteBlock: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 18,
    width: '100%',
  },
  quoteMark: {
    color: Palette.gold,
    fontFamily: Fonts?.serif,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 32,
  },
  quoteText: {
    color: Palette.inkSoft,
    fontFamily: Fonts?.serif,
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 6,
    maxWidth: 320,
    textAlign: 'center',
  },
  quoteLine: {
    backgroundColor: Palette.line,
    height: 1,
    marginTop: 22,
    width: 72,
  },
});
