import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const forestItems = [
  {
    meta: { en: 'Earned 2024.03.12 · 45 min', ko: '2024.03.12 획득 · 45분' },
    name: { en: 'Calm Fern', ko: '평온의 고사리' },
    uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=360&h=360&fit=crop',
    unlocked: true,
  },
  {
    meta: { en: 'Earned 2024.03.08 · 20 min', ko: '2024.03.08 획득 · 20분' },
    name: { en: 'Cloud Moss', ko: '구름 이끼' },
    uri: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=360&h=360&fit=crop',
    unlocked: true,
  },
  {
    meta: { en: 'Earned 2024.03.05 · 60 min', ko: '2024.03.05 획득 · 60분' },
    name: { en: 'Crystal Bud', ko: '수정 봉오리' },
    uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=360&h=360&fit=crop',
    unlocked: true,
  },
  {
    meta: { en: 'Earned 2024.02.28 · 30 min', ko: '2024.02.28 획득 · 30분' },
    name: { en: 'Echo Vine', ko: '메아리 덩굴' },
    uri: 'https://images.unsplash.com/photo-1508022713622-df2d8fb7b4cd?w=360&h=360&fit=crop',
    unlocked: true,
  },
  {
    meta: { en: '15 min focus needed', ko: '15분 집중 필요' },
    name: { en: '', ko: '' },
    uri: '',
    unlocked: false,
  },
  {
    meta: { en: 'Earned 2024.02.20 · 90 min', ko: '2024.02.20 획득 · 90분' },
    name: { en: 'Moonlit Petal', ko: '달빛 꽃잎' },
    uri: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=360&h=360&fit=crop',
    unlocked: true,
  },
] as const;

function CollectionCard({ item }: { item: (typeof forestItems)[number] }) {
  const { language } = usePreferences();

  if (!item.unlocked) {
    return (
      <View style={styles.lockedCard}>
        <View style={styles.lockCenter}>
          <SymbolView name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} tintColor={Palette.mutedLight} size={21} />
          <ThemedText style={styles.lockText}>{item.meta[language]}</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.collectionCard}>
      <View style={styles.imagePanel}>
        <Image source={{ uri: item.uri }} style={styles.collectionImage} contentFit="cover" />
      </View>
      <ThemedText style={styles.cardName}>{item.name[language]}</ThemedText>
      <ThemedText style={styles.cardMeta}>{item.meta[language]}</ThemedText>
    </View>
  );
}

export default function ForestScreen() {
  const { language } = usePreferences();
  const text = {
    en: {
      progress: 'Journey Progress',
      growth: 'Forest growth: 64%',
      seed: '12 / 20 seeds found',
      subtitle: 'Records of your clear mind and focused moments.',
      title: 'My Breaths',
    },
    ko: {
      progress: '여정의 진행도',
      growth: '숲의 성장: 64%',
      seed: '12 / 20 씨앗 발견',
      subtitle: '당신이 머문 맑은 정신과 집중의 기록들입니다.',
      title: '나의 숨결들',
    },
  }[language];

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AppHeader />

          <View style={styles.content}>
            <View style={styles.heroCopy}>
              <ThemedText style={styles.title}>{text.title}</ThemedText>
              <ThemedText style={styles.subtitle}>{text.subtitle}</ThemedText>
            </View>

            <View style={styles.progressCard}>
              <ThemedText style={styles.progressLabel}>{text.progress}</ThemedText>
              <View style={styles.progressRow}>
                <ThemedText style={styles.progressText}>{text.growth}</ThemedText>
                <ThemedText style={styles.progressText}>{text.seed}</ThemedText>
              </View>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <View style={styles.grid}>
              {forestItems.map((item, index) => (
                <CollectionCard key={`${item.name.ko || 'locked'}-${index}`} item={item} />
              ))}
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
    marginBottom: 24,
  },
  title: {
    color: Palette.ink,
    fontFamily: Fonts?.serif,
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 34,
  },
  subtitle: {
    color: Palette.inkSoft,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 8,
  },
  progressCard: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 36,
    paddingHorizontal: 19,
    paddingVertical: 22,
    shadowColor: Palette.primaryDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  progressLabel: {
    color: Palette.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 9,
    textTransform: 'uppercase',
  },
  progressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    height: 6,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: Palette.gold,
    borderRadius: 999,
    height: '100%',
    width: '64%',
  },
  grid: {
    columnGap: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  collectionCard: {
    width: '47.5%',
  },
  imagePanel: {
    alignItems: 'center',
    backgroundColor: Palette.surfaceSoft,
    borderColor: Palette.line,
    borderWidth: 1,
    borderRadius: 10,
    height: 169,
    justifyContent: 'center',
    marginBottom: 13,
    overflow: 'hidden',
    padding: 14,
  },
  collectionImage: {
    height: '100%',
    width: '100%',
  },
  cardName: {
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginLeft: 6,
  },
  cardMeta: {
    color: Palette.inkSoft,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    marginLeft: 6,
    marginTop: 1,
  },
  lockedCard: {
    alignItems: 'center',
    backgroundColor: Palette.surfaceSoft,
    borderColor: Palette.mutedLight,
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 169,
    justifyContent: 'center',
    width: '47.5%',
  },
  lockCenter: {
    alignItems: 'center',
    gap: 10,
  },
  lockText: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '600',
  },
});
