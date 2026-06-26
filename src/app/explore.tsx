import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';

const trees = [
  {
    name: '참나무',
    englishName: 'Oak',
    subtitle: '꾸준함의 기초',
    rarity: '일반',
    tone: '#DFF2E6',
    canopy: '#73B77C',
    accent: '#4F985D',
    unlocked: true,
  },
  {
    name: '벚나무',
    englishName: 'Cherry Blossom',
    subtitle: '긴 집중의 선물',
    rarity: '희귀',
    tone: '#FFE5EF',
    canopy: '#F1A7BE',
    accent: '#D96F97',
    unlocked: true,
  },
  {
    name: '소나무',
    englishName: 'Pine',
    subtitle: '흔들리지 않는 성장',
    rarity: '일반',
    tone: '#E8F0D2',
    canopy: '#4E8F5C',
    accent: '#2F6D4E',
    unlocked: true,
  },
  {
    name: '자카란다',
    englishName: 'Jacaranda',
    subtitle: '깊은 몰입의 꽃',
    rarity: '영웅',
    tone: '#E9E3FF',
    canopy: '#8D79D6',
    accent: '#6C55B8',
    unlocked: true,
  },
  {
    name: '목련',
    englishName: 'Magnolia',
    subtitle: '90분 집중 후 발견',
    rarity: '잠김',
    tone: '#EEF2EE',
    canopy: '#BFC9C0',
    accent: '#A8B3AA',
    unlocked: false,
  },
  {
    name: '단풍나무',
    englishName: 'Maple',
    subtitle: '7일 연속 성공 보상',
    rarity: '잠김',
    tone: '#EEF2EE',
    canopy: '#BFC9C0',
    accent: '#A8B3AA',
    unlocked: false,
  },
] as const;

const filters = ['전체', '일반', '희귀', '잠김'] as const;

function MiniTree({ canopy, accent, locked }: { canopy: string; accent: string; locked?: boolean }) {
  return (
    <View style={styles.miniTree}>
      <View style={[styles.miniCanopyBack, { backgroundColor: canopy }]} />
      <View style={[styles.miniCanopyLeft, { backgroundColor: accent }]} />
      <View style={[styles.miniCanopyRight, { backgroundColor: canopy }]} />
      <View style={[styles.miniTrunk, locked && styles.lockedTrunk]} />
      <View style={[styles.miniGround, { backgroundColor: accent }]} />
    </View>
  );
}

function TreeCard({ tree }: { tree: (typeof trees)[number] }) {
  return (
    <View style={[styles.card, { backgroundColor: tree.tone }, !tree.unlocked && styles.lockedCard]}>
      <View style={styles.cardTop}>
        <View style={[styles.rarityBadge, !tree.unlocked && styles.lockedBadge]}>
          <ThemedText style={[styles.rarityText, !tree.unlocked && styles.lockedText]}>{tree.rarity}</ThemedText>
        </View>
        {!tree.unlocked ? (
          <SymbolView name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} tintColor="#7E8A80" size={19} />
        ) : null}
      </View>
      <MiniTree canopy={tree.canopy} accent={tree.accent} locked={!tree.unlocked} />
      <ThemedText style={[styles.cardTitle, !tree.unlocked && styles.lockedText]}>{tree.name}</ThemedText>
      <ThemedText style={styles.cardEnglishName}>{tree.englishName}</ThemedText>
      <ThemedText style={styles.cardSubtitle}>{tree.subtitle}</ThemedText>
    </View>
  );
}

export default function ForestScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View>
                <ThemedText style={styles.eyebrow}>MY FOREST</ThemedText>
                <ThemedText style={styles.title}>내 숲</ThemedText>
              </View>
              <View style={styles.headerIcon}>
                <SymbolView name={{ ios: 'tree.fill', android: 'forest', web: 'park' }} tintColor="#204C35" size={25} />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCopy}>
                <ThemedText style={styles.summaryLabel}>수집 진행률</ThemedText>
                <ThemedText style={styles.summaryTitle}>12 / 50</ThemedText>
                <ThemedText style={styles.summaryBody}>오늘 60분을 채우면 희귀 나무를 발견할 수 있어요.</ThemedText>
              </View>
              <View style={styles.featuredTree}>
                <MiniTree canopy="#73B77C" accent="#2F7A4E" />
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.filterRow}>
              {filters.map((filter, index) => (
                <Pressable key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
                  <ThemedText style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</ThemedText>
                </Pressable>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>컬렉션</ThemedText>
              <ThemedText style={styles.sectionHint}>4개 해금</ThemedText>
            </View>

            <View style={styles.grid}>
              {trees.map(tree => (
                <TreeCard key={tree.name} tree={tree} />
              ))}
            </View>

            <View style={styles.discoveryCard}>
              <View style={styles.discoveryIcon}>
                <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor="#6D4C1E" size={23} />
              </View>
              <View style={styles.discoveryCopy}>
                <ThemedText style={styles.discoveryTitle}>다음 발견까지 15분</ThemedText>
                <ThemedText style={styles.discoveryText}>목표를 넘기면 꽃잎 배경과 보너스 물방울을 받을 수 있어요.</ThemedText>
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
    backgroundColor: '#F4F7F0',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + 104,
    width: '100%',
  },
  content: {
    maxWidth: 430,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  eyebrow: {
    color: '#6D8174',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  title: {
    color: '#132318',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 39,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#25422F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: 48,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: '#173C2A',
    borderRadius: 32,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
    overflow: 'hidden',
    padding: 18,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryLabel: {
    color: '#CFE2D5',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 46,
  },
  summaryBody: {
    color: '#CFE2D5',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 8,
  },
  featuredTree: {
    alignItems: 'center',
    backgroundColor: '#EAF5EF',
    borderRadius: 28,
    height: 122,
    justifyContent: 'center',
    width: 118,
  },
  progressTrack: {
    backgroundColor: '#DDE8DD',
    borderRadius: 999,
    height: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#2F7A4E',
    borderRadius: 999,
    height: '100%',
    width: '24%',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: '#173C2A',
  },
  filterText: {
    color: '#5F7165',
    fontSize: 13,
    fontWeight: '900',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#132318',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionHint: {
    color: '#6D8174',
    fontSize: 13,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    borderRadius: 26,
    minHeight: 210,
    padding: 14,
    width: '48%',
  },
  lockedCard: {
    opacity: 0.86,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  rarityBadge: {
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  lockedBadge: {
    backgroundColor: '#FFFFFF',
  },
  rarityText: {
    color: '#204C35',
    fontSize: 11,
    fontWeight: '900',
  },
  miniTree: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 86,
    justifyContent: 'flex-end',
    marginBottom: 13,
    marginTop: 6,
    width: 112,
  },
  miniCanopyBack: {
    borderRadius: 42,
    height: 78,
    position: 'absolute',
    top: 0,
    width: 78,
  },
  miniCanopyLeft: {
    borderRadius: 34,
    height: 66,
    left: 11,
    position: 'absolute',
    top: 30,
    width: 66,
  },
  miniCanopyRight: {
    borderRadius: 34,
    height: 66,
    position: 'absolute',
    right: 11,
    top: 30,
    width: 66,
  },
  miniTrunk: {
    backgroundColor: '#7B5632',
    borderRadius: 9,
    height: 50,
    marginBottom: 7,
    width: 22,
  },
  lockedTrunk: {
    backgroundColor: '#8D978F',
  },
  miniGround: {
    borderRadius: 999,
    bottom: 3,
    height: 10,
    position: 'absolute',
    width: '72%',
  },
  cardTitle: {
    color: '#132318',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 21,
  },
  lockedText: {
    color: '#7E8A80',
  },
  cardEnglishName: {
    color: '#5D6F63',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    marginTop: 2,
  },
  cardSubtitle: {
    color: '#516258',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 7,
  },
  discoveryCard: {
    alignItems: 'center',
    backgroundColor: '#FFE9C8',
    borderRadius: 26,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    padding: 16,
  },
  discoveryIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 17,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  discoveryCopy: {
    flex: 1,
  },
  discoveryTitle: {
    color: '#132318',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  discoveryText: {
    color: '#6D5C42',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
});
