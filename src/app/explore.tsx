import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, AvatarMenu } from '@/components/app-header';
import { useDetox } from '@/components/detox-context';
import { buildCalendarFruits, GardenTreeBackdrop } from '@/components/detox-icons';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { seedOptions, treeNames } from '@/constants/seeds';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const CANOPY_SIZE = 300;

const copy = {
  ko: {
    legendPending: '미도래',
    legendWithered: '시듦',
    subtitle: (month: string, count: number) => `${month} · 지금까지 ${count}그루를 키웠어요`,
    title: '내가 심은 씨앗',
  },
  en: {
    legendPending: 'Not yet',
    legendWithered: 'Withered',
    subtitle: (month: string, count: number) => `${month} · ${count} trees grown so far`,
    title: 'What I’ve Planted',
  },
} as const;

export default function GardenScreen() {
  const { language } = usePreferences();
  const { garden } = useDetox();
  const text = copy[language];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel =
    language === 'en'
      ? now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : `${year}년 ${month + 1}월`;

  const monthEntries = garden
    .map(entry => ({ ...entry, dateObj: new Date(entry.date) }))
    .filter(entry => entry.dateObj.getFullYear() === year && entry.dateObj.getMonth() === month)
    .map(entry => ({ day: entry.dateObj.getDate(), seedId: entry.seedId, status: entry.status }));

  const fruits = buildCalendarFruits(daysInMonth, now.getDate(), monthEntries, CANOPY_SIZE);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader right={<AvatarMenu />} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>{text.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{text.subtitle(monthLabel, garden.length)}</ThemedText>

            <View style={[styles.canopyWrap, { width: CANOPY_SIZE, height: CANOPY_SIZE }]}>
              <GardenTreeBackdrop size={CANOPY_SIZE} />
              {fruits.map(fruit => (
                <View key={fruit.day} pointerEvents="none">
                  <View
                    style={[
                      styles.fruitDot,
                      {
                        left: fruit.left - fruit.size / 2,
                        top: fruit.top - fruit.size / 2,
                        width: fruit.size,
                        height: fruit.size,
                        borderRadius: fruit.size / 2,
                        backgroundColor: fruit.background,
                        opacity: fruit.opacity,
                        borderWidth: fruit.borderWidth,
                        borderColor: fruit.borderColor,
                        borderStyle: fruit.borderStyle,
                        transform: fruit.rotateDeg ? [{ rotate: `${fruit.rotateDeg}deg` }] : undefined,
                        shadowColor: fruit.isToday ? Palette.primary : undefined,
                        shadowOpacity: fruit.isToday ? 0.35 : 0,
                        shadowRadius: fruit.isToday ? 4 : 0,
                      },
                    ]}
                  />
                  <ThemedText
                    style={[
                      styles.fruitDay,
                      {
                        left: fruit.left - 14,
                        top: fruit.top + fruit.size / 2 + 4,
                        color: fruit.isToday ? Palette.primaryDark : 'rgba(140,110,84,0.55)',
                        fontFamily: fruit.isToday ? Fonts?.display : undefined,
                        fontWeight: fruit.isToday ? '700' : '400',
                      },
                    ]}>
                    {fruit.day}
                  </ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.legendRow}>
              {seedOptions.map(seed => (
                <View key={seed.id} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: seed.fruit, borderColor: seed.canopy2, borderWidth: 2 }]} />
                  <ThemedText style={styles.legendText}>{treeNames[language][seed.id]}</ThemedText>
                </View>
              ))}
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotWithered]} />
                <ThemedText style={styles.legendText}>{text.legendWithered}</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDotPending} />
                <ThemedText style={styles.legendText}>{text.legendPending}</ThemedText>
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
    alignItems: 'center',
    maxWidth: 430,
    paddingHorizontal: Spacing.three,
    paddingTop: 4,
    width: '100%',
  },
  title: {
    alignSelf: 'flex-start',
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 20,
  },
  subtitle: {
    alignSelf: 'flex-start',
    color: Palette.textSoft,
    fontSize: 13,
    marginTop: 4,
  },
  canopyWrap: {
    marginBottom: 20,
    marginTop: 26,
    position: 'relative',
  },
  fruitDot: {
    position: 'absolute',
  },
  fruitDay: {
    fontSize: 9,
    position: 'absolute',
    textAlign: 'center',
    width: 28,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  legendDotWithered: {
    backgroundColor: '#8F7A5E',
    height: 9,
    opacity: 0.75,
    width: 9,
  },
  legendDotPending: {
    borderColor: 'rgba(140,110,84,0.4)',
    borderRadius: 4,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 8,
    width: 8,
  },
  legendText: {
    color: Palette.textSoft,
    fontSize: 11.5,
  },
});
