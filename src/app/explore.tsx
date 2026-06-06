import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const trees = [
  {
    name: '참나무',
    englishName: 'Oak',
    subtitle: '숲의 기초',
    rarity: '일반',
    badgeColor: '#F6E3D4',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Quercus%20robur%20-%20K%C3%B6hler%E2%80%93s%20Medizinal-Pflanzen-118.jpg?width=600',
  },
  {
    name: '벚나무',
    englishName: 'Cherry Blossom',
    subtitle: '봄의 아름다움',
    rarity: '희귀',
    badgeColor: '#92D5E8',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/20140328Prunus%20serrulata01.jpg?width=700',
  },
  {
    name: '신비한 야자수',
    englishName: 'Mystic Palm',
    subtitle: '오아시스의 수호자',
    rarity: '희귀',
    badgeColor: '#92D5E8',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Jacaranda%20flower.jpg?width=700',
  },
  {
    name: '소나무',
    englishName: 'Pine',
    subtitle: '꾸준한 성장',
    rarity: '일반',
    badgeColor: '#F6E3D4',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Magnolia%20tripetala%20in%20flower%20in%20northeast%20Alabama.jpg?width=700',
  },
];

function TreeCard({ tree }: { tree: (typeof trees)[number] }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: tree.imageUrl }} style={styles.treeImage} contentFit="cover" />
        <View style={[styles.rarityBadge, { backgroundColor: tree.badgeColor }]}>
          <ThemedText style={styles.rarityText}>{tree.rarity}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.cardTitle}>{tree.name}</ThemedText>
      <ThemedText style={styles.cardEnglishName}>{tree.englishName}</ThemedText>
      <ThemedText style={styles.cardSubtitle}>{tree.subtitle}</ThemedText>
    </View>
  );
}

function LockedCard() {
  return (
    <View style={styles.lockedCard}>
      <SymbolView
        name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
        size={26}
        tintColor="#B1AEA9"
      />
      <ThemedText style={styles.lockedTitle}>???</ThemedText>
      <ThemedText style={styles.lockedSubtitle}>집중하면 열려요</ThemedText>
    </View>
  );
}

export default function ForestScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.topBar}>
              <View style={styles.profileRow}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=160&h=160&fit=crop' }}
                  style={styles.avatar}
                  contentFit="cover"
                />
                <ThemedText style={styles.brandText}>포커스 숲</ThemedText>
              </View>
              <View style={styles.pointsBadge}>
                <ThemedText style={styles.pointsText}>1,240</ThemedText>
                <ThemedText style={styles.sparkleText}>✦</ThemedText>
              </View>
            </View>

            <View style={styles.hero}>
              <View>
                <ThemedText style={styles.title}>나만의 숲</ThemedText>
                <ThemedText style={styles.description}>
                  성장의 기록을{'\n'}모아보세요
                </ThemedText>
              </View>
              <View style={styles.collectionPill}>
                <ThemedText style={styles.collectionText}>12 / 50{'\n'}수집 완료</ThemedText>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.grid}>
              {trees.map(tree => (
                <TreeCard key={tree.name} tree={tree} />
              ))}
              <LockedCard />
              <LockedCard />
            </View>

            <View style={styles.discoveryCard}>
              <SymbolView
                name={{ ios: 'lightbulb', android: 'lightbulb', web: 'lightbulb' }}
                tintColor="#7A6239"
                size={25}
              />
              <View style={styles.discoveryCopy}>
                <ThemedText style={styles.discoveryTitle}>새로운 발견이 기다려요!</ThemedText>
                <ThemedText style={styles.discoveryText}>
                  오늘 60분 집중하면 전설의 나무를 발견할 수 있어요.
                </ThemedText>
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
    backgroundColor: '#FFF8F3',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + 104,
    paddingHorizontal: Spacing.three,
  },
  content: {
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.two,
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    borderRadius: 20,
    height: 42,
    width: 42,
  },
  brandText: {
    color: '#8A6F62',
    fontSize: 16,
    fontWeight: '600',
  },
  pointsBadge: {
    alignItems: 'center',
    backgroundColor: '#FFE8D7',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pointsText: {
    color: '#365C4B',
    fontSize: 18,
    fontWeight: '900',
  },
  sparkleText: {
    color: '#F1A64F',
    fontSize: 18,
    fontWeight: '900',
  },
  hero: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: '#0E0B08',
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 35,
    marginBottom: 12,
  },
  description: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 23,
  },
  collectionPill: {
    alignItems: 'center',
    backgroundColor: '#AEEBC7',
    borderRadius: 24,
    justifyContent: 'center',
    minWidth: 116,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  collectionText: {
    color: '#173B27',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 15,
    textAlign: 'center',
  },
  progressTrack: {
    backgroundColor: '#F5DAC9',
    borderRadius: 999,
    height: 13,
    marginBottom: 34,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#557865',
    borderRadius: 999,
    height: '100%',
    width: '31%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    minHeight: 208,
    paddingHorizontal: 16,
    paddingTop: 22,
    width: '47%',
  },
  imageWrap: {
    borderRadius: 5,
    height: 104,
    marginBottom: 22,
    overflow: 'visible',
    width: 104,
  },
  treeImage: {
    borderRadius: 3,
    height: '100%',
    width: '100%',
  },
  rarityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'absolute',
    right: -9,
    top: -9,
  },
  rarityText: {
    color: '#245160',
    fontSize: 10,
    fontWeight: '900',
  },
  cardTitle: {
    color: '#0E0B08',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 23,
    textAlign: 'center',
  },
  cardEnglishName: {
    color: '#7C6359',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    marginTop: 2,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#2E2723',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 6,
    textAlign: 'center',
  },
  lockedCard: {
    alignItems: 'center',
    borderColor: '#D9D4CE',
    borderRadius: 28,
    borderStyle: 'dashed',
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 208,
    paddingHorizontal: 16,
    width: '47%',
  },
  lockedTitle: {
    color: '#A8A29E',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 36,
  },
  lockedSubtitle: {
    color: '#A8A29E',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  discoveryCard: {
    alignItems: 'center',
    backgroundColor: '#FFE49C',
    borderRadius: 28,
    flexDirection: 'row',
    gap: 18,
    marginTop: 34,
    paddingHorizontal: 25,
    paddingVertical: 22,
  },
  discoveryCopy: {
    flex: 1,
  },
  discoveryTitle: {
    color: '#6D4C1E',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 21,
  },
  discoveryText: {
    color: '#7A6239',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
});
