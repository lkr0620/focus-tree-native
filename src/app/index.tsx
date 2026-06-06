import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const stats = [
  {
    label: '오늘 집중',
    value: '2시간 15분',
    icon: { ios: 'clock', android: 'schedule', web: 'schedule' },
  },
  {
    label: '연속 달성',
    value: '5일',
    icon: null,
  },
  {
    label: '포인트',
    value: '150',
    icon: { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' },
  },
] as const;

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.topBar}>
              <View style={styles.profileRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&h=160&fit=crop',
                  }}
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

            <View style={styles.titleRow}>
              <ThemedText style={styles.title}>오늘의{'\n'}정원</ThemedText>
              <ThemedText style={styles.statusText}>성장{'\n'}진행 중</ThemedText>
            </View>

            <View style={styles.gardenCard}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=900&h=900&fit=crop',
                }}
                style={styles.gardenImage}
                contentFit="cover"
              />
              <ThemedText style={styles.quote}>
                “당신의 정원이{'\n'}평온하게 숨 쉬고 있어요.”
              </ThemedText>
              <View style={styles.oxygenRow}>
                <View style={styles.oxygenDot} />
                <ThemedText style={styles.oxygenText}>산소 농도 안정적</ThemedText>
              </View>
            </View>

            <View style={styles.statsRow}>
              {stats.map(item => (
                <View key={item.value} style={styles.statCard}>
                  <View style={styles.statIcon}>
                    {item.icon ? (
                      <SymbolView name={item.icon} tintColor="#2F6D78" size={24} />
                    ) : (
                      <ThemedText style={styles.streakGlyph}>🪴</ThemedText>
                    )}
                  </View>
                  <ThemedText style={styles.statLabel}>{item.label}</ThemedText>
                  <ThemedText style={styles.statValue}>{item.value}</ThemedText>
                </View>
              ))}
            </View>

            <Pressable style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}>              
              <ThemedText style={styles.ctaText}>집중 시작하기</ThemedText>
            </Pressable>
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
    paddingBottom: BottomTabInset + 88,
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
    marginBottom: 26,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  brandText: {
    color: '#8A6F62',
    fontSize: 16,
    fontWeight: '600',
  },
  pointsBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF3E9',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 18,
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
  titleRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: '#0E0B08',
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 34,
  },
  statusText: {
    color: '#263F2E',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 17,
    marginBottom: 8,
  },
  gardenCard: {
    alignItems: 'center',
    backgroundColor: '#F7FAF8',
    borderRadius: 34,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  gardenImage: {
    aspectRatio: 1,
    marginBottom: 16,
    width: '52%',
  },
  quote: {
    color: '#0E0B08',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 25,
    marginBottom: 10,
    textAlign: 'center',
  },
  oxygenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  oxygenDot: {
    backgroundColor: '#9BB8A5',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  oxygenText: {
    color: '#4F6F5D',
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFF0E7',
    borderRadius: 34,
    flex: 1,
    minHeight: 108,
    paddingHorizontal: 10,
    paddingTop: 14,
  },
  statIcon: {
    alignItems: 'center',
    backgroundColor: '#AEE1F0',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    marginBottom: 6,
    width: 34,
  },
  streakGlyph: {
    fontSize: 18,
  },
  statLabel: {
    color: '#382B23',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
    textAlign: 'center',
  },
  statValue: {
    color: '#0E0B08',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    marginTop: 4,
    textAlign: 'center',
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: '#2F6748',
    borderRadius: 33,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: 18,
  },
  pressed: {
    opacity: 0.8,
  },
  logoText: {
    color: '#06150E',
    fontSize: 21,
    fontWeight: '300',
    letterSpacing: 0,
  },
  ctaText: {
    color: '#0A160F',
    fontSize: 17,
    fontWeight: '700',
  },
});
